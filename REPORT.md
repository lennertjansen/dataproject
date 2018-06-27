# Final Report - Programming Project

#### By: Lennert Jansen (10488952)
#### Date of submission: June 27th, 2018

### Introduction and description of the ATP Match Data Visualizations
Three interactive and linked visualizations constitute the application in question; a collapsible tree diagram or dendrogram, a bar chart and a pie chart or donut chart.
The main goal of this project is to visually represent tennis player's statistics using the aforementioned chart-types. The dendrogram is an interactive visualization that serves as a player's profile containing both personal information (i.e. height, nationality and handedness), and three match based statistics. The bar chart in the lower right corner of the screen depict the selected player's performance at the four ATP Grand Slam tournaments (The Australian Open, Roland Garros (The French Open), The Championships Wimbledon and The US Open). Finally, the donut chart, situated in the lower left corner of the screen illustrates the match winning rates of various nationalities at a selected Grand Slam tournament.

<img src="doc/screenshot.png" width="750px"/>

### Technical design
On a high level, the user can navigate across the page which consists of three visualizations: a dendrogram, a bar chart and a donut chart. Found atop of said visualizations, is a search bar (with autocompletion capabilities) where the user can search for a tennis player of interest, or simply enter "random" is he/she does not know any tennis players by heart. This input then renders the newly updated dendrogram, which now consists of three nodes: one with the player's name from which two links extend towards the nodes "Personal Stats" and "Match Stats". These clickable nodes in turn expand into three end-nodes each. The top three end-nodes contain the selected player's 

My application is built using two html pages, on one of which all three visualizations are implemented, one JavaScript file, one CSS style sheet, a Python file that converts CSV to JSON, and another JavaScript file used for data manipulation. The latter two, however, are only ran once and are no longer needed during the actual running of the application.

### Challenges of development

### Design choices and topics & ideas for future projects

### Conclusion
