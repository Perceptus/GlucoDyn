//
// The MIT License (MIT)
//
// Copyright (c) 2015 Perceptus.org
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
//
//  .88888.  dP                            888888ba
// d8'   `88 88                            88    `8b
// 88        88 dP    dP .d8888b. .d8888b. 88     88 dP    dP 88d888b.
// 88   YP88 88 88    88 88'  `"" 88'  `88 88     88 88    88 88'  `88
// Y8.   .88 88 88.  .88 88.  ... 88.  .88 88    .8P 88.  .88 88    88
//  `88888'  dP `88888P' `88888P' `88888P' 8888888P  `8888P88 dP    dP
//                                                        .88
//                                                    d8888P
// dP                    888888ba                                                 dP
// 88                    88    `8b                                                88
// 88d888b. dP    dP    a88aaaa8P' .d8888b. 88d888b. .d8888b. .d8888b. 88d888b. d8888P dP    dP .d8888b.    .d8888b. 88d888b. .d8888b.
// 88'  `88 88    88     88        88ooood8 88'  `88 88'  `"" 88ooood8 88'  `88   88   88    88 Y8ooooo.    88'  `88 88'  `88 88'  `88
// 88.  .88 88.  .88     88        88.  ... 88       88.  ... 88.  ... 88.  .88   88   88.  .88       88 dP 88.  .88 88       88.  .88
// 88Y8888' `8888P88     dP        `88888P' dP       `88888P' `88888P' 88Y888P'   dP   `88888P' `88888P' 88 `88888P' dP       `8888P88
//               .88                                                   88                                                          .88
//           d8888P                                                    dP                                                      d8888P
//
// Education is crucial in the treatment of complex and dynamic diseases such as T1D. When patients are aware of the elements that affect
// variations in their disease, they are able to better understand their situation enabling them to optimize their treatments.
//
// Accessibility through the primary method of communication in the present: Digital communication. Live data should be accessible when
// the patient needs it in the easiest possible way.
//
// Autonomy is the dream of every patient with T1D. Life does not happen while being in front of a computer or staring at data on your
// phone. Most of the times where deviations happen, patients are busy living their lives.
//
// Gustavo Muñoz ( @bustavo )
// Kenneth Stack
//

//g is time in minutes from bolus event, idur=insulin duration
//walsh iob curves
function iob(g,idur) {  
  if(g<=0.0) {
    tot=100.0
  } else if (g>=idur*60.0) {
    tot=0.0
  } else {
    if(idur==3) {
      tot=-3.203e-7*Math.pow(g,4)+1.354e-4*Math.pow(g,3)-1.759e-2*Math.pow(g,2)+9.255e-2*g+99.951
    } else if (idur==4) {
      tot=-3.31e-8*Math.pow(g,4)+2.53e-5*Math.pow(g,3)-5.51e-3*Math.pow(g,2)-9.086e-2*g+99.95
    } else if (idur==5) {
      tot=-2.95e-8*Math.pow(g,4)+2.32e-5*Math.pow(g,3)-5.55e-3*Math.pow(g,2)+4.49e-2*g+99.3
    } else if (idur==6) {
      tot=-1.493e-8*Math.pow(g,4)+1.413e-5*Math.pow(g,3)-4.095e-3*Math.pow(g,2)+6.365e-2*g+99.7
    } 
  }          
  return(tot);
}

//simpsons rule to integrate IOB - can include sf and dbdt as functions of tstar later - assume constants for now
//integrating over flux time tstar 
function intIOB(x1,x2,idur,g) {
  var integral;
  var dx;
  var nn=50; //nn needs to be even
  var ii=1;
  
  //initialize with first and last terms of simpson series
  dx=(x2-x1)/nn;
  integral=iob((g-x1),idur)+iob(g-(x1+nn*dx),idur);

  while(ii<nn-2) {
    integral = integral + 4*iob(g-(x1+ii*dx),idur)+2*iob(g-(x1+(ii+1)*dx),idur);
    ii=ii+2;
  }

  integral=integral*dx/3.0;
  return(integral);

}
            
//scheiner gi curves fig 7-8 from Think Like a Pancreas, fit with a triangle shaped absorbtion rate curve
//see basic math pdf on repo for details
//g is time in minutes,gt is carb type
function cob(g,ct) {  
  
  if(g<=0) {
    tot=0.0
  } else if (g>=ct) {
    tot=1.0
  } else if ((g>0)&&(g<=ct/2.0)) {
    tot=2.0/Math.pow(ct,2)*Math.pow(g,2)
  } else 
    tot=-1.0+4.0/ct*(g-Math.pow(g,2)/(2.0*ct))
    return(tot);
}
    
function deltatempBGI(g,dbdt,sensf,idur,t1,t2) {
  return -dbdt*sensf*((t2-t1)-1/100*intIOB(t1,t2,idur,g));
}

function deltaBGC(g,sensf,cratio,camount,ct) {
  return sensf/cratio*camount*cob(g,ct);
}

function deltaBGI(g,bolus,sensf,idur) {
  return -bolus*sensf*(1-iob(g,idur)/100.0);
}

function deltaBG(g,sensf,cratio,camount,ct,bolus,idur) {
  return deltaBGI(g,bolus,sensf,idur)+deltaBGC(g,sensf,cratio,camount,ct);
}

function GlucodynStats(bg) {
  var min=1000;
  var max=0;
  var sum=0;
  //calc average
  for(var ii=0;ii<bg.length;ii++){
    sum=sum+bg[ii];
    averagebg=sum/bg.length;
    //find min and max
    if(bg[ii]<min) {min=bg[ii];}
    if(bg[ii]>max) {max=bg[ii];}
  }

  //calc square of differences
  var dsq=0;
  for (ii=0;ii<bg.length;ii++){
    dsq=dsq+=Math.pow((bg[ii]-averagebg),2);
  }
  //calc sd
  var sd=Math.pow((dsq/bg.length),0.5);
  
  var result = [];
  result[0] = averagebg;        
  result[1] = sd;
  result[2] = min;
  result[3] = max;
  
  $("#stats_avg").text(Math.round(averagebg));
  $("#stats_min").text(Math.round(min));
  $("#stats_max").text(Math.round(max));
  $("#stats_std").text(Math.round(sd));
          
  return result;

} 
  
//user parameters - carb ratio, sensitivity factor, insulin duration      
if ( localStorage["userdata"] ) {
  var userdata = JSON.parse(localStorage["userdata"]);
} else {
  localStorage["userdata"] = JSON.stringify({cratio:0,sensf:0.0,idur:1,bginitial:0,stats:0,simlength:1,inputeffect:1});
  var userdata = JSON.parse(localStorage["userdata"]);
}

var uevent = [];
var uevent_counter = 0;

var simt = userdata.simlength*60; //total simulation time in min from zero

var simtimeadjustrecommendation = 1 // variable to allow user to receive simulation time recommendations ( valid for 1 session )

var n=75; //points in simulation
var dt=simt/n;
var simbgc = [];
var simbgi = [];
var simbg = [];
var predata =[];

for (i=0;i<n;i++) {
   simbgc[i]=0.0;
   simbgi[i]=0.0;
    simbgi[i]=userdata.bginitial;
}

// Max Sim Time
function RecommendedMaxSimTime(set_trigger) {
  
  if ( uevent.length > 0 && simtimeadjustrecommendation == 1 ) {
    
    var userdata = JSON.parse(localStorage["userdata"]);
      
    var maxsimtime=0;
    for (var ii=0;ii<uevent.length;ii++) {
      var etime=0;

      if(uevent[ii].etype=="bolus") {etime=uevent[ii].time+userdata.idur*60;}
      if (uevent[ii].etype=="carb") {etime=uevent[ii].time+uevent[ii].ctype;}
      if(uevent[ii].etype=="tempbasal") {etime=uevent[ii].t2+userdata.idur*60;}
      if (etime>maxsimtime) {maxsimtime=etime;}    
    }
          
    if ( maxsimtime > userdata.simlength*60 ) {

      $("#simtime_adjust_container").removeClass("hidden");
      $("#simtime_recommend_label").text((Math.ceil(maxsimtime/60))*60);          
              
    } else if ( Math.ceil(maxsimtime/60) < userdata.simlength ) {
    
      $("#simtime_adjust_container").removeClass("hidden");
      $("#simtime_recommend_label").text((Math.ceil(maxsimtime/60))*60);          
    
    } else {

      $("#simtime_adjust_container").addClass("hidden");
    
    }
  
    if ( set_trigger == 1 ) {
    
      userdata.simlength = Math.ceil(maxsimtime/60);
    
      localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
    
      reloadSliders();
      reloadGraphData();          
      
    }
    
  } else {
    
    $("#simtime_adjust_container").addClass("hidden");
    
  }

}
