// Function to load the Graph everytime any setting is changed
function reloadGraphData() {

  var userdata = JSON.parse(localStorage["userdata"]);

  var simt = userdata.simlength*60;
  var dt=simt/n;

  for (i=0;i<n;i++) {
     simbg[i]=userdata.bginitial; 
     simbgc[i]=0.0;
     simbgi[i]=0.0;
   }
                                            
  for (j = 0; j < uevent.length; j++) { 

    if ( uevent[j] && uevent.etype != "" ) {
    
     for (i=0; i<n;i++) {
         if(uevent[j].etype=="carb") {
           simbgc[i] = simbgc[i]+deltaBGC(i*dt-uevent[j].time,userdata.sensf,userdata.cratio,uevent[j].grams,uevent[j].ctype)
         } else if(uevent[j].etype=="bolus") { 
           simbgi[i] = simbgi[i]+deltaBGI(i*dt-uevent[j].time,uevent[j].units,userdata.sensf,userdata.idur) 
         } else {
           simbgi[i]=simbgi[i]+deltatempBGI((i*dt),uevent[j].dbdt,userdata.sensf,userdata.idur,uevent[j].t1,uevent[j].t2);
         }           
     }
    
    }
                
   }
   
   RecommendedMaxSimTime(0);
   
   var predata = new google.visualization.DataTable();
   predata.addColumn('number', 'Time'); // Implicit domain label col.
   predata.addColumn('number', 'Resulting Blood Sugar mg/dl'); // Implicit series 1 data col.
            
   if ( userdata.stats == 1 ) {
    
     // Show stats table
     $("#statistics_container").removeClass("hidden");
    
     if ( userdata.inputeffect == 1 ) {

       predata.addColumn('number', 'Carb effect on Blood Sugar mg/dl'); // Implicit series 1 data col.
       predata.addColumn('number', 'Insulin effect on Blood Sugar mg/dl'); // Implicit series 1 data col.
       
     }
    
     predata.addColumn('number', 'Average mg/dl');
     predata.addColumn('number', 'Min mg/dl');
     predata.addColumn('number', 'Max mg/dl');

     for (i=0;i<n;i++) {
       simbg[i]=userdata.bginitial+simbgc[i]+simbgi[i];
     }

     var stats = GlucodynStats(simbg);
     
     for (i=0;i<n;i++) {
        if ( userdata.inputeffect == 1 ){
          predata.addRow([(dt*i)+1,simbg[i],userdata.bginitial+simbgc[i],userdata.bginitial+simbgi[i],stats[0], stats[2], stats[3]]);                
        }else{
          predata.addRow([(dt*i)+1,simbg[i],stats[0], stats[2], stats[3]]);
        }
     }
     
     if ( userdata.inputeffect == 1 ) {
       
       var options = {
         height: 500,
         backgroundColor: 'transparent',
         title: '',
         curveType: 'function',
         legend: { position: 'bottom' },
         hAxis: {
           title: 'Time (min)',
           baselineColor: 'none'
         },
         vAxis: {
           title: 'BG mg/dl',
           baselineColor: 'none'
         },
         legend: {
           textStyle: {
             fontSize: 14 
           }
         },
         series: {
          0: { color: '#666666' },
          1: { color: '#1abc9c', lineDashStyle: [4,4] },
          2: { color: '#e74c3c', lineDashStyle: [4,4] },
          3: { color: '#999999', lineDashStyle: [12,4], lineWidth:1 },
          4: { color: '#999999', lineDashStyle: [12,4], lineWidth:1 },
          5: { color: '#999999', lineDashStyle: [12,4], lineWidth:1 }
         },
         chartArea: {'width': '90%', 'height': '80%'},
         legend: {'position': 'top'}
       };
       
     } else {
       
       var options = {
         height: 500,
         backgroundColor: 'transparent',
         title: '',
         curveType: 'function',
         legend: { position: 'bottom' },
         hAxis: {
           title: 'Time (min)',
           baselineColor: 'none'
         },
         vAxis: {
           title: 'BG mg/dl',
           baselineColor: 'none'
         },
         legend: {
           textStyle: {
             fontSize: 14 
           }
         },
         series: {
          0: { color: '#666666' },
          1: { color: '#999999', lineDashStyle: [12,4], lineWidth:1 },
          2: { color: '#999999', lineDashStyle: [12,4], lineWidth:1 },
          3: { color: '#999999', lineDashStyle: [12,4], lineWidth:1 }
         },
         chartArea: {'width': '90%', 'height': '80%'},
         legend: {'position': 'top'}
       };
       
     }
     
   } else {

     // Hide stats table
     $("#statistics_container").addClass("hidden");
     $("#stats_avg").text(Math.round("NA"));
     $("#stats_min").text(Math.round("NA"));
     $("#stats_max").text(Math.round("NA"));
     $("#stats_std").text(Math.round("NA"));
     
     if ( userdata.inputeffect == 1 ) {

       predata.addColumn('number', 'Carb effect on Blood Sugar mg/dl'); // Implicit series 1 data col.
       predata.addColumn('number', 'Insulin effect on Blood Sugar mg/dl'); // Implicit series 1 data col.
     
     }
     
     for (i=0;i<n;i++) {
       simbg[i]=userdata.bginitial+simbgc[i]+simbgi[i];
       
       if ( userdata.inputeffect == 1 ) {
         predata.addRow([(dt*i)+1,simbg[i],userdata.bginitial+simbgc[i],userdata.bginitial+simbgi[i]]);               
       }else{
         predata.addRow([(dt*i)+1,simbg[i]]);
       }

     }
    
     if ( userdata.inputeffect == 1 ) {
       
       var options = {
         height: 500,
         backgroundColor: 'transparent',
         title: '',
         curveType: 'function',
         legend: { position: 'bottom' },
         hAxis: {
           title: 'Time (min)',
           baselineColor: 'none'
         },
         vAxis: {
           title: 'BG mg/dl',
           baselineColor: 'none'
         },
         legend: {
           textStyle: {
             fontSize: 14 
           }
         },
         series: {
          0: { color: '#666666' },
          1: { color: '#1abc9c', lineDashStyle: [4,4] },
          2: { color: '#e74c3c', lineDashStyle: [4,4] },
         },
         chartArea: {'width': '90%', 'height': '80%'},
         legend: {'position': 'top'}
       };
       
     } else {
       
       var options = {
         height: 500,
         backgroundColor: 'transparent',
         title: '',
         curveType: 'function',
         legend: { position: 'bottom' },
         hAxis: {
           title: 'Time (min)',
           baselineColor: 'none'
         },
         vAxis: {
           title: 'BG mg/dl',
           baselineColor: 'none'
         },
         legend: {
           textStyle: {
             fontSize: 14 
           }
         },
         series: {
          0: { color: '#666666' },
         },
         chartArea: {'width': '90%', 'height': '80%'},
         legend: {'position': 'top'}
       };
       
     }
     
   }
     
   var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

   chart.draw(predata, options);
                            
}

// General User Settings
function showUserSettings() {
  
  var userdata = JSON.parse(localStorage["userdata"]);
  
  $("#step_two_settings").toggleClass("hidden");
  $("#carb_ratio_slider_label").text(userdata.cratio);
  $("#carb_sensitivity_slider_label").text(userdata.sensf);
  $("#insulin_duration_slider_label").text(userdata.idur);
  $("#initial_bg_slider_label").text(userdata.bginitial);
  $("#sim_duration_slider_label").text(userdata.simlength);
 
        
  if ( $("#add_insulin").hasClass("disabled") ) {} else {
    $("#add_insulin").toggleClass("disabled");        
  }

  if ( $("#step_two_insulin").hasClass("hidden") ) {} else {
    $("#step_two_insulin").toggleClass("hidden")
    resetInsulinInputs();        
  }

  if ( $("#add_carbs").hasClass("disabled") ) {} else {
    $("#add_carbs").toggleClass("disabled");
  }

  if ( $("#step_two_carbs").hasClass("hidden") ) {} else {
    $("#step_two_carbs").toggleClass("hidden")
    resetCarbInputs();        
  }
  
  if ( $("#step_two_settings").hasClass("hidden") ) {
    $("#add_insulin").toggleClass("disabled");        
    $("#add_carbs").toggleClass("disabled");                        
  }
  
}

function updateStats(checkbox_status) {

  var userdata = JSON.parse(localStorage["userdata"]);
  
  if ( checkbox_status == true ) {
    
    userdata.stats = 1
            
  } else {

    userdata.stats = 0
    
  }
  
  localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
  
  reloadGraphData();
  
}

function updateInputEffect(checkbox_status) {

  var userdata = JSON.parse(localStorage["userdata"]);
  
  if ( checkbox_status == true ) {
    
    userdata.inputeffect = 1
            
  } else {

    userdata.inputeffect = 0
    
  }
  
  localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
  
  reloadGraphData();
  
}
  
// Carb Input Functions
function showCarbsStepTwo() {
  $("#add_insulin").toggleClass("disabled");
  $("#settings").toggleClass("disabled");

  $("#step_two_carbs").toggleClass("hidden");
  
  if ( $("#step_two_carbs").hasClass("hidden") ) {
    resetCarbInputs();
  }     
}

function resetCarbInputs() {
  
  $('#carb_time_slider').slider({value: 0});
  $("#carb_time_slider_label").text(0);

  $("#carb_amount_slider_label").text(0);
  $('#carb_amount_slider').slider({value: 0});

  $("#carb_type_slider_label").text(0);
  $('#carb_type_slider').slider({value: 0});
  
  $('.carb_type').removeAttr('checked');
      
}

function addCarbsToModel() {
        
  if ( $("#carb_amount_slider").slider("option", "value") > 0 && $("#carb_type_slider").slider("option", "value") > 0 ) {

    uevent_counter = uevent_counter + 1;
  
    uevent.push({id: uevent_counter, time: $("#carb_time_slider").slider("option", "value"),etype:"carb",grams: $("#carb_amount_slider").slider("option", "value"),ctype:$("#carb_type_slider").slider("option", "value")});        
    reloadGraphData();
    
    $("#step_two_carbs").toggleClass("hidden");
    $("#add_insulin").toggleClass("disabled");
    $("#settings").toggleClass("disabled");
  
    resetCarbInputs();
    addEventHistory();

  }
        
}

// Insulin Input Functions
function showInsulinStepTwo() {
  $("#add_carbs").toggleClass("disabled");
  $("#settings").toggleClass("disabled");

  $("#step_two_insulin").toggleClass("hidden");
  
  if ( $("#step_two_insulin").hasClass("hidden") ) {
    resetInsulinInputs();
  }
}

$("input:radio[name='treatment_type']").change(
  function() {
    if ( $("input:radio[name='treatment_type']:checked").val() == "bolus" ) {
      $("#bolus_time").removeClass("hidden");
      $("#bolus_amount").removeClass("hidden");
      $("#temp_basal_range").addClass("hidden");
      $("#temp_basal_amount").addClass("hidden");
    } else if ( $("input:radio[name='treatment_type']:checked").val() == "temp_basal" ) {
      $("#temp_basal_range").removeClass("hidden");
      $("#temp_basal_amount").removeClass("hidden");
      $("#bolus_time").addClass("hidden");
      $("#bolus_amount").addClass("hidden");
    }
  }
)
 
function resetInsulinInputs() {
  
  $('#bolus_time_slider').slider({value: 0});
  $("#bolus_time_slider_label").text(0);

  $("#bolus_amount_slider_label").text(0);
  $('#bolus_amount_slider').slider({value: 0});
  
  $('#tempbasal_time_slider').find('.ui-slider-value:first').text(0)
  $('#tempbasal_time_slider').find('.ui-slider-value:last').text(30)
  $('#tempbasal_time_slider').slider({values: [0,30]});

  $("#tempbasal_amount_slider_label").text(0);
  $('#tempbasal_amount_slider').slider({value: 0});
  
}

function addInsulinToModel() {
        
  if ( $("input:radio[name='treatment_type']:checked").val() == "bolus" ) {
    
    if ( $("#bolus_amount_slider").slider("option", "value") > 0 ) {

      uevent_counter = uevent_counter + 1;
      uevent.push({id: uevent_counter, time: $("#bolus_time_slider").slider("option", "value"),etype:"bolus",units: $("#bolus_amount_slider").slider("option", "value")});        

      reloadGraphData();
              
      $("#step_two_insulin").toggleClass("hidden");
      $("#add_carbs").toggleClass("disabled");
      $("#settings").toggleClass("disabled");

      resetInsulinInputs();
      addEventHistory();

    }
    
  } else if ( $("input:radio[name='treatment_type']:checked").val() == "temp_basal" ) {        

    uevent_counter = uevent_counter + 1;
    uevent.push({id: uevent_counter, time: $("#tempbasal_time_slider").slider("option", "values")[0],etype:"tempbasal",t1: $("#tempbasal_time_slider").slider("option", "values")[0],t2: $("#tempbasal_time_slider").slider("option", "values")[1],dbdt: $("#tempbasal_amount_slider").slider("option", "value")});        

    reloadGraphData();
              
    $("#step_two_insulin").toggleClass("hidden");
    $("#add_carbs").toggleClass("disabled");
    $("#settings").toggleClass("disabled");

    resetInsulinInputs();
    addEventHistory();

  }
  
}

// Event History
function addEventHistory() {
  
  var event = uevent[uevent.length - 1];
  var event_index = uevent.length - 1;
  var event_id = event.id
  var description = ""
  
  if(event.etype == "carb") {
    description = "<span id='amount_label_" + event_id +"'>" + event.grams + "</span> gr of carbs (" + event.ctype + " min absorption time)";
    description_b = "Taken @ min <span id='time_label_" + event_id +"'>"+ event.time +"</span>"
  } else if(event.etype=="bolus") { 
    description = "<span id='amount_label_" + event_id +"'>" + event.units + "</span> U insulin input";
    description_b = "Taken @ min <span id='time_label_" + event_id +"'>"+ event.time +"</span>"
  } else if (event.etype=="tempbasal") {
    description = "" + event.dbdt + " U/min temp basal input";
    description_b = "From min "+ event.t1 +" to min "+ event.t2 +""
  }           
              
  if(event.etype == "carb" || event.etype == "bolus") {
    
    $("#input_history").append("<div class='row' class='history_row' id='uevent_" + event_id +"'><div class='col-xs-12'><div class='row'><div class='col-xs-6'>" + description + "</div><div class='col-xs-6'><div class='col-xs-10'>" + description_b + "</div><div class='col-xs-2'><a id='' href='#new_event_link' class='' onclick='removeEvent("+ event_id +");'><span class='fui-trash'></span></a></div></div></div><div class='row'><div class='col-xs-6'><div id='history_amount_slider_" + event_id +"' class='ui-slider'></div></div><div class='col-xs-6'><div id='history_time_slider_" + event_id +"' class='ui-slider'></div></div></div></div></div>");
    
    $("#history_time_slider_" + event_id).slider({
      min: 0,
      max: simt,
      step: 1,
      value: event.time,
      orientation: 'horizontal',
      range: false,
      slide: function(event, ui) {
        $("#time_label_" + event_id).text(ui.value);
        
        for (i=0;i<(uevent.length);i++) {
          if ( uevent[i].id == event_id ) {
            uevent[i].time = ui.value;
          }
        }
        
        reloadGraphData(); 
      }
    });
    
    if(event.etype == "carb") {
      
      $("#history_amount_slider_" + event_id).slider({
        min: 0,
        max: 200,
        step: 0.5,
        value: event.grams,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#amount_label_" + event_id).text(ui.value);

          for (i=0;i<(uevent.length);i++) {
            if ( uevent[i].id == event_id ) {
              uevent[i].grams = ui.value;
            }
          }

          reloadGraphData();          
        }
      });
      
    } else if (event.etype == "bolus") {  
      
      $("#history_amount_slider_" + event_id).slider({
        min: 0,
        max: 20,
        step: 0.1,
        value: event.units,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#amount_label_" + event_id).text(ui.value);

          for (i=0;i<(uevent.length);i++) {
            if ( uevent[i].id == event_id ) {
              uevent[i].units = ui.value;
            }
          }

          reloadGraphData();          
        }
      });
      
    }
    
  } else {
    
    $("#input_history").append("<div class='row' id='uevent_" + event_id +"'><div class='col-xs-10'>" + description + "</div><div class='col-xs-2'><a id='' href='#new_event_link' class='' onclick='removeEvent("+ event_id +");'><span class='fui-trash'></span></a></div></div>");
    
  }
              
  $("#input_history_container").removeClass("hidden");
  
}

function removeEvent(event_id) {

  $("#uevent_" + event_id).remove();
  
  for (i=0;i<(uevent.length);i++) {
    if ( uevent[i].id == event_id ) {
      uevent.splice(i,1);
    }
  }
              
  reloadGraphData();
  
  if ( uevent.length == 0 ) {
    $("#input_history_container").addClass("hidden");
  }
  
}

// Sliders Reload
function reloadSliders() {
  var userdata = JSON.parse(localStorage["userdata"]);
        
  $('#carb_time_slider').slider("option","max",userdata.simlength*60);
  $('#bolus_time_slider').slider("option","max",userdata.simlength*60);
  $('#tempbasal_time_slider').slider("option","max",userdata.simlength*60);
  
  for (i=0;i<(uevent.length);i++) {
    $("#history_time_slider_" + uevent[i].id).slider("option","max",userdata.simlength*60);
  }
        
}
        
// Document Ready
$(document).ready(function(){
  if ( userdata.cratio == 0 && userdata.sensf == 0.0 && userdata.idur == 1 && userdata.bginitial == 0 ) {
    showUserSettings();
  };
  
  reloadGraphData();
  
  $(window).resize(function(){
    reloadGraphData();
  });
  
});
