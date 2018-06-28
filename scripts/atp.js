/*
*
* Name: Lennert Jansen
* Student number: 10488952
* Date of submission: 28 June 2018
* Final Programming Project: ATP Match Data Visualisations
*
*/


// execute when DOM is loaded and calls all functions
window.onload = function() {

    // append segment to body containing author and assignment information
    authorInfo = d3.select("#personalInfoContainer")
        .append("p").text("Name: Lennert Jansen")
        .append("p").text("Student number: 10488952")
        .append("p").text("Course: Programming project, spring 2018")

    // create empty object for ATP match data
    playerData = [];

    // retrieve data from JSON file for manipulation with D3
    d3.json("playerdata_new.json", function(data) {

        playerData = data;

        playerNames = getValues(data, "name");

        // ensure initial visualizations display Roger Federer's statistics
        makeTree(playerData, 213);
        makeBarChart(playerData, 213, 0);
        updateBarchart(playerData, 213);
        makePie(playerData, "Wimbledon", 0, "SUI", 4);

        // eventlistener autocompletes searched term and renders graphs
        $(document).ready(function(){
            $("#myInput").on("keyup", function() {
                var value = $(this).val().toLowerCase();
                autocomplete(document.getElementById("myInput"), playerNames);
                for (i = 0; i < playerData.length; i++){
                    if (value == playerData[i].name.toLowerCase()){
                        makeTree(playerData, i);
                        makeBarChart(playerData, i, 0);
                        updateBarchart(playerData, i);
                        break;
                    } else if (value == "random"){
                        randomNumber = Math.floor(Math.random() * playerData.length);
                        makeTree(playerData, randomNumber);
                        makeBarChart(playerData, randomNumber, 0);
                        updateBarchart(playerData, randomNumber);
                        break;

                    }
                };
          });
        });

    });

};

// renders dendrogram when page is loaded or when player is searched
// adaptation of the following source: https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
function makeTree(data, playerNumber){

    // remove current dendrogram
    d3.select('#tree').remove();

    // create variable for selected player by indexing in list of all players
    player = data[playerNumber];

    // create data object for dendrogram containing necessary data exclusively
    var treeData =
    {
    "name": player.name,
    "children": [
      {
        "name": "Personal Stats",
        "children": [
          { "name": "Nationality: " + player.nationality },
          { "name": "Height: " + player.height + " cm" },
          { "name" : "Hand: " + player.hand}

        ]
      },
      {
          "name": "Match Stats" ,
          "children" : [
              { "name" : "Match Winning Rate: " + round(player.win_rate * 100, 2) + "%" },
              { "name" : "Average No. of Aces per Match: " + round(player.mean_ace, 2)},
              { "name" : "Average No. of Double Faults per Match: " + round(player.mean_df, 2)}
          ]
      }
    ]
    };

    // set the dimensions and margins of the diagram
    var treeMargin = {top: 40, right: 90, bottom: 30, left: 200},
        treeOuterWidth = 1000;
        treeOuterHeight = 500;
        treeWidth = treeOuterWidth - treeMargin.left - treeMargin.right,
        treeHeight = treeOuterHeight - treeMargin.top - treeMargin.bottom;

    // append the svg object to the body of the page
    var treeSvg = d3.select("#divTree").append("svg").attr("id", "tree")
        .attr("width", treeOuterWidth)
        .attr("height", treeOuterHeight)
        .append("g")
        .attr("transform", "translate("
              + treeMargin.left + "," + treeMargin.top + ")");

    // create info box for tip containing age category and population size
    var treeHelpTip = d3.tip()
      .attr("class", "d3-tip")
      .attr("id", "treeHelpTip")
      .offset([-20, 0]).html(function(d, i) {
       return "The collapsible tree diagram (or dendrogram) serves as a tennis player's profile."
       + "<br>" + "When clicked, the tennis ball 'nodes' ultimately expand into end nodes."
       + "<br>" + "The top three end nodes contain a player's personal information."
       + "<br>" + "Whereas the bottom three end nodes contain a player's match statistics."
       + "<br>" + "The latter three are clickable and in turn update the Bar Chart below with the desired match statistic."});

    // call dendrogram help tooltip
    treeSvg.call(treeHelpTip);

    treeSvg.append('text')
        //.attr('id', 'test')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '30px' )
        .attr('x', treeWidth)
        .attr('y', treeMargin.top)
        .text(function(d) { return '\uf059' })
        .on("mouseover", treeHelpTip.show)
        .on("mouseout", treeHelpTip.hide);

    // append chart title
    treeSvg.append("text")
        .attr('class', 'chartTitle')
        .attr('id', 'treeTitle')
        .attr('x', treeWidth * (3 / 4))
        .attr('y', treeMargin.top)
        .attr('text-anchor', 'end')
        .text('Collapsible Tree Diagram of ' + player.name)

    // declare variables for iterations and duration
    var i = 0,
        duration = 750,
        root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([treeHeight, treeWidth]);

    // assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = treeHeight / 2;
    root.y0 = 0;

    // collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // collapse the node and all it's children
    function collapse(d){

    if(d.children){

        d._children = d.children;

        d._children.forEach(collapse);

        d.children = null;

    };
    };

    // update functions for nodes and links
    function update(source){

      // assigns the x and y position for the nodes
      var treeData = treemap(root);

      // compute the new tree layout
      var nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

      // normalize for fixed-depth
      nodes.forEach(function(d){ d.y = d.depth * 180});

      // update the nodes
      var node = treeSvg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

      // enter any new modes at the parent's previous position
      var nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "LawnGreen" : "#fff";
        })
        .on('click', function(d){
            if(d._children == undefined ){
                if (d.data.name == "Match Winning Rate: " + round(player.win_rate * 100, 2) + "%" ){
                    return makeBarChart(data, playerNumber, 0);
                } else if (d.data.name == "Average No. of Aces per Match: " + round(player.mean_ace, 2)){
                    return makeBarChart(data, playerNumber, 1);
                } else if (d.data.name == "Average No. of Double Faults per Match: " + round(player.mean_df, 2)){
                    return makeBarChart(data, playerNumber, 2);
                };
            };
        });

      // add labels for the nodes
      nodeEnter.append('text')
          .attr("dy", ".35em")
          .attr("x", function(d) {
              return d.children || d._children ? -13 : 13;
          })
          .attr("text-anchor", function(d) {
              return d.children || d._children ? "end" : "start";
          })
          .text(function(d) { return d.data.name; });

      // update the nodes
      var nodeUpdate = nodeEnter.merge(node);

      // transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
         });

      // update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "LawnGreen" : "#fff";
        })
        .attr('cursor', 'pointer');

      // remove any exiting nodes
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();

      // on exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // on exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // update links between nodes
      var link = treeSvg.selectAll('path.link')
          .data(links, function(d) { return d.id; });

      // enter any new links at the parent's previous position
      var linkEnter = link.enter().insert('path', "g")
          .attr("class", "link")
          .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          });

      // update the links between nodes
      var linkUpdate = linkEnter.merge(link);

      // transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', function(d){ return diagonal(d, d.parent) });

      // remove any exiting links
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove();

      // store the old positions for transition
      nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`

        return path
      }

      // toggle children on click
      function click(d) {
        if (d.children){

            d._children = d.children;

            d.children = null;

          } else {
            d.children = d._children;

            d._children = null;

          }

        update(d);

    };
    }

    // call bar chart function using a player object as an argument
    makeBarChart(data, playerNumber, 2);

    // update barchart
    updateBarchart(data);

};

// renders barchart on page load
function makeBarChart(data, playerNumber, statistic){

    // clear current visualization
    d3.select('#barchart').remove();

    // select relevant player data by indexing in list of all players
    player = data[playerNumber]

    // create list of objects for the dropdown menus
    var selectData = [  { "label" : "Match Winning Rate (%)", "aus" : "win_rate_aus", "rg" : "win_rate_rg", "wim" : "win_rate_wim", "us" : "win_rate_us", "total" : "win_rate" },
                        { "label" : "Average Number of Aces per Match", "aus" : "mean_ace_aus", "rg" : "mean_ace_rg", "wim" : "mean_ace_wim", "us" : "mean_ace_us", "total" : "mean_ace" },
                        { "label" : "Average Number of Double Faults per Match", "aus" : "mean_df_aus", "rg" : "mean_df_rg", "wim" : "mean_df_wim", "us" : "mean_df_us", "total" : "mean_df" },
                    ];
    var selection = selectData[statistic];

    // create data object containing data needed for barchart exclusively
    var barchartData = [ {"tourney_name" : "Australian Open", "stat" : player[selection.aus]},
        {"tourney_name" : "Roland Garros", "stat" : player[selection.rg]},
        {"tourney_name" : "Wimbledon", "stat" : player[selection.wim]},
        {"tourney_name" : "US Open", "stat" : player[selection.us]}
    ];

    // set dimensions for profile's side of svg canvas
    var barchartMargin = {
        top: 30,
        right: 105,
        bottom: 50,
        left: 70
    };
    barchartOuterWidth = 725;
    barchartOuterHeight = 500;
    barchartWidth = barchartOuterWidth - barchartMargin.left - barchartMargin.right;
    barchartHeight = barchartOuterHeight - barchartMargin.top - barchartMargin.bottom;

    // apply desired formatting for percentages
    var formatPercent = d3.format('.2%');

    // render svg canvas for bar chart
    var barSvg = d3.select("#divBar").append("svg")
        .attr("id", "barchart")
    	.attr("width", barchartOuterWidth)
        .attr("height", barchartOuterHeight)
    	.append("g")
        .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")");

    // create info box for tip containing age category and population size
    var barHelpTip = d3.tip()
      .attr("class", "d3-tip")
      .attr("id", "barHelpTip")
      .offset([-20, 0]).html(function(d, i) {
       return "Welcome to the bar chart segment of my page. Here we can observed the selected player's performance on the four ATP Grand Slam tournaments"
       + "<br>" + "The order of the bars correspond to the order in which the tournaments are held in a year (from left to right)."
       + "<br>" + "When clicked on, a Grand Slam bar updates the donut chart to the right of this bar chart."});

    // call help tooltip function for bars
    barSvg.call(barHelpTip);

    // append question mark for help tooltip
    barSvg.append('text')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '30px' )
        .attr('x', barchartWidth)
        .attr('y', barchartMargin.top)
        .text(function(d) { return '\uf059' })
        .on("mouseover", barHelpTip.show)
        .on("mouseout", barHelpTip.hide);

    // append chart title
    barSvg.append("text")
        .attr('class', 'chartTitle')
        .attr('id', 'barchartTitle')
        .attr('x', barchartWidth * (2 / 4))
        .attr('y', barchartMargin.top - 20)
        .attr('text-anchor', 'middle')
        .text('Bar Chart of ' + player.name + "'s Grand Slam performance");

    // create ordinale scale for x variables and linear scale of y variables
    var xScale = d3.scaleOrdinal()
        .range([0, barchartWidth]);

    // list containing four tournament names in most readable form
    var tournaments = ["Australian Open", "Roland Garros", "Wimbledon", "US Open"];

    // create d3 scale for y variable
    var yScale = d3.scaleLinear()
			.domain([0, d3.max(data, function(d){
				return +d[selection.total];
			})])
			.range([barchartHeight, 0]);

    // initialize x axis
    var xAxis = d3.axisBottom()
        .scale(xScale);

    // initialize y axis
    var yAxis = d3.axisLeft()
        .scale(yScale);

    // create info box for tip containing name, population and density
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-20, 0]).html(function(d, i) {
         return "<strong>Tournament: </strong> <span style='color:grey'>" + d.tourney_name
          + "</span>" + "<br>" + "Value: " + round(d.stat, 3) + "<br>"});

    // call tooltio function for every bar
    barSvg.call(tip);

    // render rect element for every variable
    barSvg.selectAll("bar")
        .data(barchartData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", (barchartWidth / barchartData.length) - 0.5)
        .attr("height", function(d) {
			return barchartHeight -  yScale(+d.stat);
		})
        .attr("x", function(d, i) {
			return (barchartWidth / barchartData.length) * i ;
		})
        .attr("y", function(d){
			return yScale(+d.stat);
		})
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function(d) {
            return makePie(data, d.tourney_name, statistic, player.nationality, 4)
        });

    // draw y axis
    barSvg.append("g")
        .attr('id', 'barchartYAxis')
        .attr('class', 'barchartAxis')
        .call(yAxis);

    // write y axis label
    barSvg.append("text")
        .attr('class', 'axisLabel')
        .attr('id', 'yAxisLabel')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(selectData[statistic].label);

    // draw x axis
    barSvg.append("g")
        .attr('id','barchartXAxis')
        .attr("class", "barchartAxis")
        .attr("transform", "translate(0, " + barchartHeight + ")")
        .call(xAxis)
        .selectAll("text")
    	.style("font-size", "8px")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-45)" );

    // draw bar labels under x axis
    for (var i = 0; i < tournaments.length; i++){

        barSvg.append("text")
            .attr('class', 'axisLabel')
            .attr('id', 'xAxisLabel')
            //.attr('transform', "translate(1000, " + barchartHeight + ")")
            .attr('x', (barchartWidth / (barchartData.length * 2)) * ((2 * i) + 1) )
            .attr('y', barchartHeight + 15)
            .style('text-anchor', 'middle')
            .style("font-size", "8px")
            .text(tournaments[i]);

    };

};

// renders pie chart when specific bar is clicked
function makePie(data, tournament, statistic, playerNationality, slices){

    // call update pie function so it can listen voor events in dropdown menu
    updatePie(data, tournament, statistic, playerNationality);

    // clear current chart
    d3.select('#pieChart').remove();

    // create list of objects for the dropdown menus
    var selectData = [  { "label" : "Match Winning Rate (%)", "aus" : "win_rate_aus", "rg" : "win_rate_rg", "wim" : "win_rate_wim", "us" : "win_rate_us", "total" : "win_rate" },
                        { "label" : "Average Number of Aces per Match", "aus" : "mean_ace_aus", "rg" : "mean_ace_rg", "wim" : "mean_ace_wim", "us" : "mean_ace_us", "total" : "mean_ace" },
                        { "label" : "Average Number of Double Faults per Match", "aus" : "mean_df_aus", "rg" : "mean_df_rg", "wim" : "mean_df_wim", "us" : "mean_df_us", "total" : "mean_df" },
                    ];
    var selection = selectData[statistic];

    // find corresponding IOC nation code for specific tournament
    if (tournament == "Roland Garros"){
        tournament_code = "win_rate_rg";
        tournament_country = "FRA"

    }
    else if (tournament == "Australian Open"){
        tournament_code = "win_rate_aus"
        tournament_country = "AUS"
    }
    else if (tournament == "Wimbledon"){
        tournament_code = "win_rate_wim"
        tournament_country = "GBR"
    }
    else{
        tournament_code = "win_rate_us"
        tournament_country = "USA"
    };

    // create empty array in which a list of nation IOC codes will be stored
    var nationalities = [];

    // iterate through data and find all nationalities
    for (let i = 0; i < data.length; i++){

        if (!nationalities.includes(data[i].nationality)){

            nationalities.push(data[i].nationality);

        };

    };

    // create empty list in which the data needed for donut chart will be stored
    pieData = [];

    // iterate through data using nationalities and find filter data for chart
    for (let i = 0; i < nationalities.length; i++){

        country_sum = 0;

        country_rate_sum = 0;

        for (let j = 0; j < data.length; j++){

            if (data[j].nationality == nationalities[i]){

                country_sum++;

                country_rate_sum += data[j][tournament_code];

            };

        };

        pieObject = {
            "country" : nationalities[i],
            "stat" : country_rate_sum / country_sum
        };

        pieData.push(pieObject);

    };

    // ensure the selected player's nationality and host country are included
    playerObject = getObjects(pieData, "country", playerNationality);
    countryObject = getObjects(pieData, "country", tournament_country);

    // sort data in ascending order of relevant statistic
    ascendingOrder(pieData, "stat")

    // create shortened list of data objects containing the top 4 countries and nationality of selected player
    pieData = pieData.slice(pieData.length - slices, pieData.length);
    pieData.push(playerObject[0]);
    pieData.push(countryObject[0]);

    // remove duplicate nationalities from pie chart data
    pieData = removeDuplicates(pieData, "country");

    // set dimensions for the pie chart's side of svg canvas
    var pieMargin = {
        top: 30,
        bottom: 50,
        left: 35,
        right: 105
    };
    pieOuterWidth = 500;
    pieOuterHeight = 500;
    pieWidth = pieOuterWidth - pieMargin.left - pieMargin.right;
    pieHeight = pieOuterHeight - pieMargin.top - pieMargin.bottom;
    radius = Math.min(pieWidth, pieHeight) / 2;

    // apply desired formatting for percentages
    var formatPercent = d3.format('.2%');

    // create svg element for pie chart
    var pieSvg = d3.select("#divPie").append("svg")
        .attr('id', 'pieChart')
        .attr("width", pieOuterWidth)
        .attr("height", pieOuterHeight);

    // create info box for tip containing age category and population size
    var pieHelpTip = d3.tip()
      .attr("class", "d3-tip")
      .attr("id", "pieHelpTip")
      .offset([-20, 0]).html(function(d, i){
       return "Finally, we arrive at the donut (or pie) chart depicting the match winning rates of various countries at a selected Grand Slam."
       + "<br>" + "The visualisation has been implemented such that the country from which the selected player resides, as well as the country in which the selected Grand Slam is hosted are added to the visualisation."
       + "<br>" + "Furthermore, the user can select up to six of the top performing nations to be added to the diagram for comparison."});

    // call help tooltip function
    pieSvg.call(pieHelpTip);

    // append question mark glyphicon to svg canvas in upper right corner
    pieSvg.append('text')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '30px' )
        .attr('x', pieWidth + pieMargin.right)
        .attr('y', pieMargin.top + 30)
        .text(function(d) { return '\uf059' })
        .on("mouseover", pieHelpTip.show)
        .on("mouseout", pieHelpTip.hide);

    // append g element to center of pie chart svg canvas
    g = pieSvg.append("g").attr('transform', "translate(" + pieOuterWidth / 2 + ", " + pieOuterHeight / 2 +")");

    // append chart title
    pieSvg.append("text")
        .attr('class', 'chartTitle')
        .attr('id', 'pieChartTitle')
        .attr('x', pieOuterWidth * (2 / 4))
        .attr('y', pieMargin.top)
        .attr('font-size', '5px')
        .attr('text-anchor', 'middle')
        .text("The winning rate of various nationalities at " + tournament);

    // create variable for pie chart using d3's built in function
    var pie = d3.pie()
        .sort(null)
        .startAngle(1.1 * Math.PI)
        .endAngle(3.1 * Math.PI)
        .value(function(d){
            return d.stat;
        });

    // countries for legend
    countries =[];
    for (i = 0; i < pieData.length; i++){
        countries.push(pieData[i].country);
    };

    // create ordinal colorscale for legend and piechart using colorbrewer
    var color = d3.scaleOrdinal()
        .domain(countries)
        .range(colorbrewer.Set2[pieData.length]);

    // create extra function to show full variablenames in legend
    var legendLines = d3.scaleOrdinal()
        .domain(countries)
        .range(colorbrewer.Set2[pieData.length]);

    // creating legend
    var graphLegend = d3.legendColor()
        .shape("path", d3.symbol()
        .type(d3.symbolSquare)
        .size(700)())
        .labelOffset(12)
        .scale(legendLines);

    // placing legend
    pieSvg.append("g")
        .attr("id", "legendbox")
        .attr("width", 300)
        .attr("height", 300);

    // append legend
    pieSvg.append("g")
        .attr("id", "graphLegend")
        .attr("transform", "translate(0, 100)");
    pieSvg.select("#graphLegend")
        .call(graphLegend);

    // create info box for tip containing age category and population size
    var pieTip = d3.tip()
        .attr("class", "d3-tip")
        .attr("id", "pieTip")
        .offset([-20, 0]).html(function(d, i) {
         return "<strong>Country: </strong> <span style='color:white'>" + d.data.country
          + "</span>" + "<br>" + "Value: " + round(d.data.stat, 2)});

    // call tooltip function for pie slices
    pieSvg.call(pieTip);

    // set sizes of outer and inner radii, respectively
    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);

    // assign 'arc' classes to our groups of data
    var arc = g.selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // add our generated arcs to create paths for each of the pie / donut wedges
    arc.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .on("mouseover", pieTip.show)
        .on("mouseout", pieTip.hide)
        .transition().delay(function(d,i) {
            return i * 5;
        })
        .duration(750)
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return path(d)
            };
        })


    // create circle in centre of donut displaying data
    pieSvg.append("svg:circle")
        .attr('transform', "translate(" + pieOuterWidth / 2 + ", " + pieOuterHeight / 2 +")")
        .attr("r", radius * 0.6)
        .style("fill", '#E7E7E7');

    // append tournament name to center of donut chart
    pieSvg.append('text')
        .attr('transform', "translate(" + pieOuterWidth / 2 + ", " + pieOuterHeight / 2 +")")
        .attr('class', 'center-txt type')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('opacity', 0.5)
        .text(tournament)


};

// updates barchart on user generated input when dropdown menu is used
function updateBarchart(data, number){

    playerNumber = number;

    // assign variables to eventlistening DOM elements from dropdown menu
    var butWin = document.getElementById("selectWin");
    var butAce = document.getElementById("selectAce");
    var butDf = document.getElementById("selectDf");

    // update barchart function when user clicks on certain dropdown item
    butWin.addEventListener("click", {
    handleEvent: function (event){
      makeBarChart(data, playerNumber, 0)
    }
    });
    butAce.addEventListener("click", {
    handleEvent: function (event){
      makeBarChart(data, playerNumber, 1)
    }
    });
    butDf.addEventListener("click", {
    handleEvent: function (event) {
      makeBarChart(data, playerNumber, 2)
    }
    });

};

// updates the piechart, giving the user the option to pick the number of slices
function updatePie(data, tournament, statistic, playerNationality){

    // assign variables to every pie chart dropdown item when clicked on
    var but2 = document.getElementById("button2");
    var but3 = document.getElementById("button3");
    var but4 = document.getElementById("button4");
    var but5 = document.getElementById("button5");
    var but6 = document.getElementById("button6");

    // update donut chart accordingly for every possible dropdown menu event
    but2.addEventListener("click", {
    handleEvent: function (event){
      makePie(data, tournament, statistic, playerNationality, 2);
    }
    });
    but3.addEventListener("click", {
    handleEvent: function (event) {
     makePie(data, tournament, statistic, playerNationality, 3);
    }
    });
    but4.addEventListener("click", {
    handleEvent: function (event) {
      makePie(data, tournament, statistic, playerNationality, 4);
    }
    });
    but5.addEventListener("click", {
    handleEvent: function (event) {
      makePie(data, tournament, statistic, playerNationality, 5);
    }
    });
    but6.addEventListener("click", {
    handleEvent: function (event){
      makePie(data, tournament, statistic, playerNationality, 6);
    }
    });

};

// function for rounding number to a desired amount of decimals
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};

//return an array of keys that match on a certain value
//source: https://gist.github.com/iwek/3924925
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
};

// function for elimination of duplicate elements in lists
Array.prototype.unique = function() {

    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;

    });

};

//return an array of objects according to key, value, or key and value matching
//source: https://gist.github.com/iwek/3924925
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
//source: https://gist.github.com/iwek/3924925
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
};

// takes in an (incomplete) string argument and array and autocompletes upon selection
// source: https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {

    // current selected item in list
    var currentFocus;

    // execute a function when someone writes in the text field
    inp.addEventListener("input", function(e) {

        var a, b, i, val = this.value;

        //close any already open lists of autocompleted values
        closeAllLists();

        if (!val) {
          return false;
        };

        // set currentfocus to -1 so indexing is inhibited
        currentFocus = -1;

        //create a DIV element that will contain the items (values)
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        //append the DIV element as a child of the autocomplete container
        this.parentNode.appendChild(a);

        //for each item in the array
        for (i = 0; i < arr.length; i++) {

            //check if the item starts with the same letters as the text field value
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){

                //create a DIV element for each matching element
                b = document.createElement("DIV");

                //make the matching letters bold
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);

                // insert a input field that will hold the current array item's value
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                // execute a function when someone clicks on the item value (DIV element)
                b.addEventListener("click", function(e){

                    //insert the value for the autocomplete text field
                    inp.value = this.getElementsByTagName("input")[0].value;

                    //close autocompleted values, or any other autocompleted values
                    closeAllLists();

              });

              a.appendChild(b);

            }
        }
    });

    function addActive(x) {

        // a function to classify an item as "active"
        if (!x) return false;

        // start by removing the "active" class on all items
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        // add class "autocomplete-active"
        x[currentFocus].classList.add("autocomplete-active");
    };

    function removeActive(x) {

        // a function to remove the "active" class from all autocomplete items
        for (var i = 0; i < x.length; i++) {

          x[i].classList.remove("autocomplete-active");

        };
    };

    function closeAllLists(elmnt) {

            // close all autocomplete lists in the document, except the one passed as an argument
            var x = document.getElementsByClassName("autocomplete-items");

            for (var i = 0; i < x.length; i++){

                if (elmnt != x[i] && elmnt != inp){

                    x[i].parentNode.removeChild(x[i]);

                };
            };
    };

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
};

// accepts list of objects and key based on which list is sorted in ascending order
function ascendingOrder(list, key){

    list.sort(function(a, b){
        return a[key] - b[key]
    });

    return list;

};

// Remove duplicates from an array of objects in javascript
// source: https://gist.github.com/lmfresneda/9158e06a93a819a78b30cc175573a8d3
function removeDuplicates( arr, prop ) {
  let obj = {};
  return Object.keys(arr.reduce((prev, next) => {
    if(!obj[next[prop]]) obj[next[prop]] = next;
    return obj;
  }, obj)).map((i) => obj[i]);
}
