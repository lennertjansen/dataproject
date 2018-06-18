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
    authorInfo = d3.select("body")
        .append("p").text("Name: Lennert Jansen")
        .append("p").text("Student number: 10488952")
        .append("p").text("Course: Programming project, spring 2018")

    // create empty object for ATP match data
    playerNames = [];
    playerData = [];

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

    // retrieve data from JSON file for manipulation with D3
    d3.json("playerdata_new.json", function(data) {

        // // store JSON data in seperate lists created above
        // // the iteration starts at 1 as the first object is redundant
        // for (var iter = 1; iter < data.length; iter++){
        //
        //     playerNames.push(data[iter]["winner_name"]);
        //     playerNames.push(data[iter]["loser_name"]);
        //
        // };
        //
        // // eliminate duplicate elements
        // playerNames = playerNames.unique();
        //
        // //console.log(getValues(data, 'winner_hand'));
        //
        // for (var iter = 0; iter < playerNames.length; iter++){
        //
        //     gamesWon = getObjects(data, 'winner_name', playerNames[iter]);
        //     gamesLost = getObjects(data, 'loser_name', playerNames[iter]);
        //
        //     gamesPlayed = gamesWon.concat(gamesLost)
        //
        //     var rank_sum = 0;
        //     var ace_sum = 0;
        //     var df_sum = 0;
        //
        //     for (var i = 0; i < gamesWon.length; i++){
        //
        //         rank_sum += Number(gamesWon[i]["winner_rank"]);
        //         ace_sum += Number(gamesWon[i]["w_ace"]);
        //         df_sum += Number(gamesWon[i]["w_df"]);
        //
        //     };
        //
        //     for (var i = 0; i < gamesLost.length; i++){
        //
        //         rank_sum += Number(gamesLost[i]["loser_rank"]);
        //         ace_sum += Number(gamesLost[i]["l_ace"]);
        //         df_sum += Number(gamesLost[i]["l_df"]);
        //
        //     };
        //
        //     playerObject = {
        //         "name" : playerNames[iter],
        //         "nationality" : gamesPlayed[0]["winner_ioc"],
        //         "height" : gamesPlayed[0]["winner_ht"],
        //         "hand" : gamesPlayed[0]["winner_hand"],
        //         "games_played" : gamesPlayed.length,
        //         "win_rate" : (gamesWon.length / gamesPlayed.length),
        //         "mean_rank" : (rank_sum / gamesPlayed.length),
        //         "mean_ace" : (ace_sum / gamesPlayed.length),
        //         "mean_df" : (df_sum / gamesPlayed.length)
        //         };
        //
        //     playerData.push(playerObject);
        //
        // };
        //
        // console.log(playerData);
        //
        // console.log(JSON.stringify(playerData));

        playerData = data;

        //makeProfile(playerData);

        makeTree(playerData);

    });

};

// creates player profile visualisation
function makeProfile(data){

    console.log(data);

    playerNumber = Math.floor(Math.random() * 743);
    //playerNumber = 213;


    // set dimensions for profile's side of svg canvas
    var profileMargin = {
        top: 30,
        right: 105,
        bottom: 50,
        left: 70,
        textSpacing: 20
    };
    profileOuterWidth = 500;
    profileOuterHeight = 500;
    profileWidth = profileOuterWidth - profileMargin.left - profileMargin.right;
    profileHeight = profileOuterHeight - profileMargin.top - profileMargin.bottom;

    // apply desired formatting for percentages
    var formatPercent = d3.format('.2%');

    // create svg element for player profile
    var profileSvg = d3.select('body').append('svg')
        .attr('width', profileOuterWidth)
        .attr('height', profileOuterHeight)
        .append('g')
        .attr('transform', 'translate(' + profileMargin.left + ', ' + profileMargin.top +')');

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerName')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight)
        .style("text-anchor", "start")
        .text("Name: " + data[playerNumber]["name"]);

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerNationality')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + profileMargin.textSpacing)
        .style("text-anchor", "start")
        .text("Nationality: " + data[playerNumber]["nationality"]);

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerHeight')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + (2 * profileMargin.textSpacing))
        .style("text-anchor", "start")
        .text("Height: " + data[playerNumber]["height"] + " cm");

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerHand')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + (3 * profileMargin.textSpacing))
        .style("text-anchor", "start")
        .text("Handedness: " + data[playerNumber]["hand"]);

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerRank')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + (4 * profileMargin.textSpacing))
        .style("text-anchor", "start")
        .text("Average ATP rank: " + round(data[playerNumber]["mean_rank"], 2));

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerWinRate')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + (5 * profileMargin.textSpacing))
        .style("text-anchor", "start")
        .text("Match winning rate: " + round(data[playerNumber]["win_rate"], 2) + " %");

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerAce')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + (6 * profileMargin.textSpacing))
        .style("text-anchor", "start")
        .text("Average no. of aces per match: " + round(data[playerNumber]["mean_ace"], 2));

    profileSvg.append("text")
        .attr('class', 'playerProfileText')
        .attr('id', 'playerDf')
        .attr("transform", "translate(0 " + profileHeight + ")")
        .attr("x", 0)
        .attr("y", -profileHeight + (7 * profileMargin.textSpacing))
        .style("text-anchor", "start")
        .text("Average no. of double faults per match: " + round(data[playerNumber]["mean_df"], 2));

    // profileSvg.append('g')
    //     .enter()
    //     .append('image')
    //     .attr("xlink:href", "https://github.com/favicon.ico")
    //     .attr("transform", "translate(0 " + profileHeight + ")")
    //     .attr("x", profileWidth)
    //     .attr("y", -6)
    //     .attr("width", 16)
    //     .attr("height", 16);

    // call bar chart function using a player object as an argument
    makeBarChart(data, playerNumber, 2);

    updateBarchart(data);

};

function updateBarchart(data){

    playerNumber = Math.floor(Math.random() * 743);

      // console.log('verververver', data)

      var butWin = document.getElementById("selectWin");
      var butAce = document.getElementById("selectAce");
      var butDf = document.getElementById("selectDf");

      // eventhandler > roept linegraph functie aan met de data die je wil hebben

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

function makeBarChart(data, playerNumber, statistic){

    // // remove current svg's if others are added by clicking on dropdown
    // if (d3.select("#barchart").select("svg")){
    //     d3.select("#barchart").select("svg").remove();
    // };

    d3.select('#barchart').remove();


    player = data[playerNumber]
    //player = data[213];

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

    console.log(player);

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
    var barSvg = d3.select("body").append("svg")
        .attr("id", "barchart")
    	.attr("width", barchartOuterWidth)
        .attr("height", barchartOuterHeight)
    	.append("g")
        .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")");

    //
    // // create dropdown menu and corresponding span for y axis variables
    // var span = barSvg.append('span')
    //     .text('Select y-axis variable: ');
    //
    // var yInput = barSvg.append('select')
    //     .attr('id','ySelect')
    //     .on('change',yChange)
    //     .selectAll('option')
    //     .data(selectData)
    //     .enter()
    //     .append('option')
    //     .attr('value', function (d) { return d.text })
    //     .text(function (d) { return d.label ;});
    //
    // // break for space between menus
    // barSvg.append('br')

    // create ordinale scale for x variables and linear scale of y variables
    var xScale = d3.scaleOrdinal()
        //.domain(["win_rate_aus", "win_rate_rg", "win_rate_wim", "win_rate_us"])
        .domain(["Australian Open", "Roland Garros", "Wimbledon", "US Open"])
        .range([0, barchartWidth]);

    // var yScale = d3.scaleLinear()
    //     //.domain(d3.extent(data, function(d) {return data.win_rate_aus})).nice()
    //     .domain([0, 1]).nice()
    //     .range([barchartHeight, 0]);

    var yScale = d3.scaleLinear()
			.domain([0, d3.max(data, function(d){
				return +d[selection.total];
			})])
			.range([barchartHeight, 0]);

    // initialize both axes
    var xAxis = d3.axisBottom()
        .scale(xScale);

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
        .on("mouseover", tip.show) // ensure tip appears and disappears
        .on("mouseout", tip.hide);

    // draw y axis
    barSvg.append("g")
        .attr('id', 'barchartYAxis')
        .attr('class', 'barchartAxis')
        .call(yAxis);

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


    // var selector = d3.select("#drop")
    // 	.append("select")
    // 	.attr("id","dropdown")
    // 	.on("change", function(d){
    //     	selection = document.getElementById("dropdown");
    //
    //     	yScale.domain([0, d3.max(data, function(d){
	// 			return +d[selection.value];})]);
    //
    //     	yAxis.scale(y);
    //
    //     	d3.selectAll(".rectangle")
    //        		.transition()
	//             .attr("height", function(d){
	// 				return height - y(+d[selection.value]);
	// 			})
	// 			.attr("x", function(d, i){
	// 				return (width / data.length) * i ;
	// 			})
	// 			.attr("y", function(d){
	// 				return y(+d[selection.value]);
	// 			})
    //        		.ease("linear")
    //        		.select("title")
    //        		.text(function(d){
    //        			return d.State + " : " + d[selection.value];
    //        		});
    //
    //        	d3.selectAll("g.y.axis")
    //        		.transition()
    //        		.call(yAxis);
    //
    //      });
    //
    //  selector.selectAll("option")
    //    .data(selectData)
    //    .enter().append("option")
    //    .attr("value", function(d){
    //      return d.;
    //    })
    //    .text(function(d){
    //      return d.label;
    //    })

    //makePie(data, "win_rate_wim");

};

function makePie(data, tournament){

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

                country_rate_sum += data[j].win_rate_wim;

            };


        };

        pieObject = {
            "country" : nationalities[i],
            "country_win_rate" : country_rate_sum / country_sum
        }

        pieData.push(pieObject);

    };

    // set dimensions for the pie chart's side of svg canvas
    var pieMargin = {
        top: 30,
        bottom: 50,
        left: 35,
        right: 105
    };
    pieOuterWidth = 425;
    pieOuterHeight = 500;
    pieWidth = pieOuterWidth - pieMargin.left - pieMargin.right;
    pieHeight = pieOuterHeight - pieMargin.top - pieMargin.bottom;
    radius = Math.min(pieWidth, pieHeight) / 2;

    // apply desired formatting for percentages
    var formatPercent = d3.format('.2%');

    // create svg element for pie chart
    var pieSvg = d3.select("body").append("svg")
        .attr('id', 'pieChart')
        .attr("width", pieOuterWidth)
        .attr("height", pieOuterHeight);

    // append g element to center of pie chart svg canvas
    g = pieSvg.append("g").attr('transform', "translate(" + pieWidth / 2 + ", " + pieHeight / 2 +")");

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.country_win_rate;
        });

    var colors = d3.scaleQuantize()
        .domain([0, 100])
        .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

    var color = d3.scaleOrdinal(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

    // set sizes of outer and inner radii, respectively
    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(20);

    var arc = g.selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            return colors(d.country_win_rate * 100);
        });

    makeTree(data, 213);

};

function makeTree(data){

    playerNumber = Math.floor(Math.random() * 743);

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
    var treeSvg = d3.select("body").append("svg")
        .attr("width", treeOuterWidth)
        .attr("height", treeOuterHeight)
        .append("g")
        .attr("transform", "translate("
              + treeMargin.left + "," + treeMargin.top + ")");

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

      // ****************** Nodes section ***************************

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

      // ****************** links section ***************************

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

    updateBarchart(data);

};

// function for rounding number to a desired amount of decimals
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};
