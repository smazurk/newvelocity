tau.mashups
.addDependency('libs/jquery/jquery')
.addDependency('tau/configurator')
.addMashup(function(configurator) {


	
  	 	 
   require(['//cdn.jsdelivr.net/jqplot/1.0.7/jquery.jqplot.js'], function() {
		var report = function() {
          
        
	$('a:contains("Planning")').after($('<a id="new_sprint_velocity" href="#">New Sprint Velocity</a>'));

	$('#new_sprint_velocity').click(showReport)   
        
       
        
	function getOptions(handleData) {
                 var acid = window.location.search.match(/acid=([0-9A-F]{32})/)[1];
 		 $.ajax({
                        type: 'GET',
                        url: appHostAndPath+'/api/v1/Releases/?include=[Name, Id,Project[Name]]&format=json&orderBy=Project.Name&acid=' + acid,
                        context: $(this)[0],
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(resp) {
                           handleData(resp); 
            		}
			   
                    });
	}

        function showReport() {
                 
  
  		  
    		$("td.col-two").html('').append(
		$('<h1>Select the release</h1><select id="velocity-releaseID"></select><br><br><div id="newsprintvelocity"></div><BR><link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/jqplot/1.0.7/jquery.jqplot.css" />' +
                  '<script type="text/javascript" src="//cdn.jsdelivr.net/jqplot/1.0.7/plugins/jqplot.pointLabels.min.js"></script>' + 
                  '<script type="text/javascript" src="//cdn.jsdelivr.net/jqplot/1.0.7/plugins/jqplot.categoryAxisRenderer.min.js"></script>' +
                  '<script type="text/javascript" src="//cdn.jsdelivr.net/jqplot/1.0.7/plugins/jqplot.barRenderer.min.js"></script>' +              
                  '<BR><div id="chart1" style="height: 500px; width: 700px; position: relative;"></div>'));
		$("#velocity-releaseID").live("change", function() {
                                                                
                        
			currentEntity = $("#velocity-releaseID").val();
          		
         		runReport(currentEntity);
			
		});

		getOptions(function(output){
                                        
                        var options = "";  
                	for (var i = 0; i < output.Items.length; ++i) {
                            options += '<option value="' + output.Items[i].Id + '">' + output.Items[i].Project.Name + ' ' + output.Items[i].Name + '</option>';
                        }
                  $("#velocity-releaseID").append('<option value="0">-- None --</option>');  
                  $("#velocity-releaseID").append(options);
		});
		
                    
                  
                    
		
	}
        
        
  	function runReport(releaseID) {
                   
        	// clear report
		$("#newsprintvelocity").html("").hide();
            	$("#chart1").html("");
              
              	if(releaseID == 0){
                  return;
                }
		var table = $("<table class='newvelocityoptions' style='width: 1500px'></table>");
              
		$("#newsprintvelocity").append(table);
                
              	getData(function(output){
                                        
                        var options = "";
                        var usArray = new Array(); 
                        var bugArray = new Array(); 
                        var esVelocity = new Array();
                        var sprintNames = new Array();
                        var currentTotal = new Array();
                        
                	for (var i = 0; i < output.Items.length; ++i) {
                                
                        	
                                options += output.Items[i].Name + '<BR>';
                        	options += "Estimated Velocity: " + output.Items[i].Velocity + '<BR>';
                                options += "Bugs: " + output.Items[i]["Bugs-EffortCompleted-Sum"] + '<BR>';
                        	options += "UserStory:" + output.Items[i]["UserStories-EffortCompleted-Sum"] + '<BR>';
                    		var s = output.Items[i]["Bugs-EffortCompleted-Sum"] + output.Items[i]["UserStories-EffortCompleted-Sum"];
                      		options += "Sum: " + s + '<BR><BR>';
                          	
                         	usArray.push(output.Items[i]["Bugs-EffortCompleted-Sum"]);
                            	bugArray.push(output.Items[i]["UserStories-EffortCompleted-Sum"]);  
                                esVelocity.push(output.Items[i].Velocity);
                                sprintNames.push(output.Items[i].Name);
                                currentTotal.push(output.Items[i]["Bugs-EffortCompleted-Sum"]+output.Items[i]["UserStories-EffortCompleted-Sum"]);
                        	
                        }
                        
                       
                        var correctArray = new Array();
			correctArray.push(bugArray);
                        correctArray.push(usArray);
                        correctArray.push(currentTotal);
                        correctArray.push(esVelocity);
                        
                        if (output.Items.length == 0)
                        return;
                        
                        $(".newvelocityoptions").append(options);
                        doRun(correctArray,sprintNames);
                        //console.log(options);
                 	
		}, releaseID);
                
		//$("#newsprintvelocity").show();		
        
        }
   
        
     
       function doRun(correctArray,sprintNames){
               

  //console.log(correctArray);
 
  plot3 = $.jqplot('chart1', correctArray, {
    // Tell the plot to stack the bars.
    stackSeries: true,
    captureRightClick: true,
    seriesDefaults:{
      renderer:$.jqplot.BarRenderer,
      rendererOptions: {
          // Put a 30 pixel margin between bars.
          barMargin: 30,
          // Highlight bars when mouse button pressed.
          // Disables default highlighting on mouse over.
          highlightMouseDown: true   
      },
      pointLabels: {show: true}
    },
   
     series:[ 
           {label:'User Stories', color:'#3399FF',renderer:$.jqplot.BarRenderer}, 
           {label:'Bugs', color:'#FF0000',renderer:$.jqplot.BarRenderer},
           {label:'Actual Velocity', renderer:$.jqplot.LineRenderer, color:'black', disableStack:true },
           {label:'Estimated Velocity', renderer:$.jqplot.LineRenderer, color:'yellow', disableStack:true }
          	
           ], 
    axes: {
      xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer,
          ticks: sprintNames
      },
      yaxis: {
        // Don't pad out the bottom of the data range.  By default,
        // axes scaled as if data extended 10% above and below the
        // actual range to prevent data points right on grid boundaries.
        // Don't want to do that here.
        padMin: 0
      }
    },
    legend: {
      show: true,
      location: 'e',
      placement: 'outside'
    }    
  });
  
  
       };
        
        
        
        
        function getData(handleData, releaseID) {

                    console.log();
                                                 
                                                 
                    $.ajax({
                        type: 'GET',
                        url: appHostAndPath+'/api/v1/Iterations?include=[Velocity,Name,Release]&append=[UserStories-EffortCompleted-Sum,%20Bugs-EffortCompleted-Sum]&where=Release.Id%20eq%20' + releaseID + '&format=json&orderby=startdate',
                        context: $(this)[0],
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(resp) {
                           handleData(resp); 
            		}
			   
                    });
	}
        
                                   
         };
                                          
              new report();                             
         });
	
       
        
});