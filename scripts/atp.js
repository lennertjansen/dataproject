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

        makeProfile(playerData)

    });

};

// creates player profile visualisation
function makeProfile(data){

    console.log(data);

    playerNumber = Math.floor(Math.random() * 743);

    // set dimensions for profile's side of svg canvas
    var profileMargin = {
        top: 30,
        right: 105,
        bottom: 50,
        left: 70,
        textSpacing: 20
    };
    profileOuterWidth = 725;
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

};

function makeBarChart(data){



};

// function for rounding number to a desired amount of decimals
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};
