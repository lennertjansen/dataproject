/*
*
* Name: Lennert Jansen
* Student number: 10488952
* Date: 11 June 2018
* Final Programming Project: ATP Match Data Visualisations
*
*/


// execute when DOM is loaded
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

        makeTree(playerData, 213);
        makeBarChart(playerData, 213, 0);
        updateBarchart(playerData, 213);
        makePie(playerData, "Wimbledon", 0, "SUI", 4);
        // data, tournament, statistic, playerNationality, slices

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

// updates barchart on user generated input when dropdown menu is used
function updateBarchart(data, number){

    playerNumber = number;

      var butWin = document.getElementById("selectWin");
      var butAce = document.getElementById("selectAce");
      var butDf = document.getElementById("selectDf");

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

      var but2 = document.getElementById("button2");
      var but3 = document.getElementById("button3");
      var but4 = document.getElementById("button4");
      var but5 = document.getElementById("button5");
      var but6 = document.getElementById("button6");

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

// renders barchart on page load
function makeBarChart(data, playerNumber, statistic){

    d3.select('#barchart').remove();

    player = data[playerNumber]

    // create list of objects for the dropdown menus
    var selectData = [  { "label" : "Match Winning Rate (%)", "aus" : "win_rate_aus", "rg" : "win_rate_rg", "wim" : "win_rate_wim", "us" : "win_rate_us", "total" : "win_rate" },
                        { "label" : "Average Number of Aces per Match", "aus" : "mean_ace_aus", "rg" : "mean_ace_rg", "wim" : "mean_ace_wim", "us" : "mean_ace_us", "total" : "mean_ace" },
                        { "label" : "Average Number of Double Faults per Match", "aus" : "mean_df_aus", "rg" : "mean_df_rg", "wim" : "mean_df_wim", "us" : "mean_df_us", "total" : "mean_df" },
                    ];
    var selection = selectData[statistic];

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

    barSvg.call(barHelpTip);

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

    var tournaments = ["Australian Open", "Roland Garros", "Wimbledon", "US Open"];

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

    barSvg.call(tip);

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

    for (var i = 0; i < tournaments.length; i++){

        // draw bar labels under x axis
        barSvg.append("text")
            .attr('class', 'axisLabel')
            .attr('id', 'xAxisLabel')
            //.attr('transform', "translate(1000, " + barchartHeight + ")")
            .attr('x', (barchartWidth / (barchartData.length * 2)) * ((2 * i) + 1) )
            .attr('y', barchartHeight + 15)
            .style('text-anchor', 'middle')
            .style("font-size", "8px")
            .text(tournaments[i]);

    }

};

// renders pie chart when specific bar is clicked
function makePie(data, tournament, statistic, playerNationality, slices){

    updatePie(data, tournament, statistic, playerNationality);

    d3.select('#pieChart').remove();

    // create list of objects for the dropdown menus
    var selectData = [  { "label" : "Match Winning Rate (%)", "aus" : "win_rate_aus", "rg" : "win_rate_rg", "wim" : "win_rate_wim", "us" : "win_rate_us", "total" : "win_rate" },
                        { "label" : "Average Number of Aces per Match", "aus" : "mean_ace_aus", "rg" : "mean_ace_rg", "wim" : "mean_ace_wim", "us" : "mean_ace_us", "total" : "mean_ace" },
                        { "label" : "Average Number of Double Faults per Match", "aus" : "mean_df_aus", "rg" : "mean_df_rg", "wim" : "mean_df_wim", "us" : "mean_df_us", "total" : "mean_df" },
                    ];
    var selection = selectData[statistic];

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
    }

    var nationalities = [];

    for (let i = 0; i < data.length; i++){

        if (!nationalities.includes(data[i].nationality)){

            nationalities.push(data[i].nationality);

        };

    };

    pieData = [];

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
        }

        pieData.push(pieObject);

    };

    playerObject = getObjects(pieData, "country", playerNationality);
    countryObject = getObjects(pieData, "country", tournament_country);

    // sort data in ascending order of relevant statistic
    ascendingOrder(pieData, "stat")

    // create shortened list of data objects containing the top 4 countries and nationality of selected player
    pieData = pieData.slice(pieData.length - slices, pieData.length);

    pieData.push(playerObject[0]);
    pieData.push(countryObject[0]);

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
      .offset([-20, 0]).html(function(d, i) {
       return "Finally, we arrive at the donut (or pie) chart depicting the match winning rates of various countries at a selected Grand Slam."
       + "<br>" + "The visualisation has been implemented such that the country from which the selected player resides, as well as the country in which the selected Grand Slam is hosted are added to the visualisation."
       + "<br>" + "Furthermore, the user can select up to six of the top performing nations to be added to the diagram for comparison."});

    pieSvg.call(pieHelpTip);

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

    var pie = d3.pie()
        .sort(null)
        .startAngle(1.1*Math.PI)
        .endAngle(3.1*Math.PI)
        .value(function(d) {
            return d.stat;
        });

    countries =[];
    for (i = 0; i < pieData.length; i++){
        countries.push(pieData[i].country);
    };

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

    pieSvg.append("g")
        .attr("id", "graphLegend")
        .attr("transform", "translate(0, 300)");

    pieSvg.select("#graphLegend")
        .call(graphLegend);

    // create info box for tip containing age category and population size
    var pieTip = d3.tip()
        .attr("class", "d3-tip")
        .attr("id", "pieTip")
        .offset([-20, 0]).html(function(d, i) {
         return "<strong>Country: </strong> <span style='color:white'>" + d.data.country
          + "</span>" + "<br>" + "Value: " + round(d.data.stat, 2)});

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
        //.attr("d", path)
        .attr("fill", function(d, i) {
            return color(i);
        })
        .on("mouseover", pieTip.show) // ensure tip appears and disappears
        .on("mouseout", pieTip.hide)
        .transition().delay(function(d,i) {
            return i * 5;
        })
        .duration(500)
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
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

    pieSvg.append('text')
        .attr('transform', "translate(" + pieOuterWidth / 2 + ", " + pieOuterHeight / 2 +")")
        .attr('class', 'center-txt type')
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('opacity', 0.5)
        .text(tournament)


};

// renders dendrogram when page is loaded or when player is searched
// adaptation of the following source: https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
function makeTree(data, playerNumber){

    d3.select('#tree').remove();

    player = data[playerNumber];

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
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
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

    var i = 0,
        duration = 750,
        root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([treeHeight, treeWidth]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = treeHeight / 2;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(function(d){ d.y = d.depth * 180});

      // Update the nodes...
      var node = treeSvg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // Add Circle for the nodes
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

      // Add labels for the nodes
      nodeEnter.append('text')
          .attr("dy", ".35em")
          .attr("x", function(d) {
              return d.children || d._children ? -13 : 13;
          })
          .attr("text-anchor", function(d) {
              return d.children || d._children ? "end" : "start";
          })
          .text(function(d) { return d.data.name; });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
         });

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "LawnGreen" : "#fff";
        })
        .attr('cursor', 'pointer');


      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // Update the links...
      var link = treeSvg.selectAll('path.link')
          .data(links, function(d) { return d.id; });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', "g")
          .attr("class", "link")
          .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', function(d){ return diagonal(d, d.parent) });

      // Remove any exiting links
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`

        return path
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
        update(d);
      }
    }

    // call bar chart function using a player object as an argument
    makeBarChart(data, playerNumber, 2);

    // update barchart
    updateBarchart(data);

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
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  // /*execute a function presses a key on the keyboard:*/
  // inp.addEventListener("keydown", function(e) {
  //     var x = document.getElementById(this.id + "autocomplete-list");
  //     if (x) x = x.getElementsByTagName("div");
  //     if (e.keyCode == 40) {
  //       /*If the arrow DOWN key is pressed,
  //       increase the currentFocus variable:*/
  //       currentFocus++;
  //       /*and and make the current item more visible:*/
  //       addActive(x);
  //     } else if (e.keyCode == 38) { //up
  //       /*If the arrow UP key is pressed,
  //       decrease the currentFocus variable:*/
  //       currentFocus--;
  //       /*and and make the current item more visible:*/
  //       addActive(x);
  //     } else if (e.keyCode == 13) {
  //       /*If the ENTER key is pressed, prevent the form from being submitted,*/
  //       e.preventDefault();
  //       if (currentFocus > -1) {
  //         /*and simulate a click on the "active" item:*/
  //         if (x) x[currentFocus].click();
  //       }
  //     }
  // });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

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
