/*
*
* Name: Lennert Jansen
* Student number: 10488952
* Date: 11 June 2018
* Final Programming Project: ATP Match Data Visualisations
*
*/



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
    d3.json("atp_gs_1995_2016_test.json", function(data) {

        // store JSON data in seperate lists created above
        // the iteration starts at 1 as the first object is redundant
        for (var iter = 1; iter < data.length; iter++){

            playerNames.push(data[iter]["winner_name"]);
            playerNames.push(data[iter]["loser_name"]);

        };

        // eliminate duplicate elements
        playerNames = playerNames.unique();

        //console.log(getValues(data, 'winner_hand'));

        for (var iter = 0; iter < playerNames.length; iter++){

            gamesWon = getObjects(data, 'winner_name', playerNames[iter]);
            gamesLost = getObjects(data, 'loser_name', playerNames[iter]);

            gamesPlayed = gamesWon.concat(gamesLost)

            var rank_sum = 0;
            var ace_sum = 0;
            var df_sum = 0;

            for (var i = 0; i < gamesWon.length; i++){

                rank_sum += Number(gamesWon[i]["winner_rank"]);
                ace_sum += Number(gamesWon[i]["w_ace"]);
                df_sum += Number(gamesWon[i]["w_df"]);

            };

            for (var i = 0; i < gamesLost.length; i++){

                rank_sum += Number(gamesLost[i]["loser_rank"]);
                ace_sum += Number(gamesLost[i]["l_ace"]);
                df_sum += Number(gamesLost[i]["l_df"]);

            };

            playerObject = {
                "name" : playerNames[iter],
                "nationality" : gamesPlayed[0]["winner_ioc"],
                "height" : gamesPlayed[0]["winner_ht"],
                "hand" : gamesPlayed[0]["winner_hand"],
                "games_played" : gamesPlayed.length,
                "win_rate" : (gamesWon.length / gamesPlayed.length),
                "mean_rank" : (rank_sum / gamesPlayed.length),
                "mean_ace" : (ace_sum / gamesPlayed.length),
                "mean_df" : (df_sum / gamesPlayed.length)
                };

            playerData.push(playerObject);

        };

        console.log(playerData);

    });

};
