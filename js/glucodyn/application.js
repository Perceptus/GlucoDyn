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

// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function (num) {
  return new Array(Math.round(num) + 1).join(this);
};

(function ($) {

  // Add segments to a slider
  $.fn.addSliderSegments = function () {
    return this.each(function () {
      var $this = $(this),
          option = $this.slider('option'),
          amount = (option.max - option.min)/option.step,
          orientation = option.orientation;
      if ( 'vertical' === orientation ) {
        var output = '', i;
        for (i = 1; i <= amount - 1; i++) {
            output += '<div class="ui-slider-segment" style="top:' + 100 / amount * i + '%;"></div>';
        }
        $this.prepend(output);
      } else {
        var segmentGap = 100 / (amount) + '%';
        var segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
        $this.prepend(segment.repeat(amount - 1));
      }
    });
  };

  $(function () {

    // Checkboxes and Radio buttons
    $('[data-toggle="checkbox"]').radiocheck();
    $('[data-toggle="radio"]').radiocheck();

    // Tooltips
    $('[data-toggle=tooltip]').tooltip('show');

    // jQuery UI Sliders
    var $slider = $('#carb_time_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: simt,
        step: 1,
        value: 0,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#carb_time_slider_label").text(ui.value);
        }
      }).addSliderSegments();
    }

    var $slider = $('#carb_amount_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: 200,
        step: 0.5,
        value: 0,
        orientation: 'horizontal',
        range: "min",
        slide: function(event, ui) {
          $("#carb_amount_slider_label").text(ui.value);
        }
      }).addSliderSegments();
    }

    $(".carb_type").change(function(){
      
      // On change, update the slider.
      if ( $("input[name='carb_type']:checked").val() == "low" ) {
        
        $("#carb_type_slider_label").text(240);
        $('#carb_type_slider').slider({value: 240});
        
      } else if ( $("input[name='carb_type']:checked").val() == "medium" ) {

        $("#carb_type_slider_label").text(180);
        $('#carb_type_slider').slider({value: 180});
        
      } else if ( $("input[name='carb_type']:checked").val() == "high" ) {
        
        $("#carb_type_slider_label").text(90);
        $('#carb_type_slider').slider({value: 90});
        
      }
            
    });

    var $slider = $('#carb_type_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: 300,
        step: 1,
        value: 0,
        orientation: 'horizontal',
        range: "min",
        slide: function(event, ui) {
          $("#carb_type_slider_label").text(ui.value);
        }
      }).addSliderSegments();
    }

    var $slider = $('#carb_ratio_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 1,
        max: 100,
        step: 0.5,
        value: userdata.cratio,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#carb_ratio_slider_label").text(ui.value);

          var userdata = JSON.parse(localStorage["userdata"]);

          userdata.cratio = ui.value
          
          localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
          
          reloadGraphData();
          
        }
      }).addSliderSegments();
    }

    var $slider = $('#carb_sensitivity_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 1,
        max: 100,
        step: 0.5,
        value: userdata.sensf,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#carb_sensitivity_slider_label").text(ui.value);

          var userdata = JSON.parse(localStorage["userdata"]);

          userdata.sensf = ui.value
          
          localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
          
          reloadGraphData();
          
        }
      }).addSliderSegments();
    }

    var $slider = $('#insulin_duration_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 1,
        max: 6,
        step: 1.0,
        value: userdata.idur,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#insulin_duration_slider_label").text(ui.value);

          var userdata = JSON.parse(localStorage["userdata"]);

          userdata.idur = ui.value
          
          localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
          
          reloadGraphData();
          
        }
      }).addSliderSegments();
    }
          
    var $slider = $('#initial_bg_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: 300,
        step: 10.0,
        value: userdata.bginitial,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#initial_bg_slider_label").text(ui.value);

          var userdata = JSON.parse(localStorage["userdata"]);

          userdata.bginitial = ui.value
          
          localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
          
          reloadGraphData();
          
        }
      }).addSliderSegments();
    }

    var $slider = $('#sim_duration_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 1,
        max: 24,
        step: 1,
        value: userdata.simlength,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#sim_duration_slider_label").text(ui.value);

          var userdata = JSON.parse(localStorage["userdata"]);

          userdata.simlength = ui.value
          
          localStorage["userdata"] = JSON.stringify({cratio:userdata.cratio,sensf:userdata.sensf,idur:userdata.idur,bginitial:userdata.bginitial,stats:userdata.stats,simlength:userdata.simlength,inputeffect:userdata.inputeffect});
          
          reloadGraphData();          
        }, 
        change: function() {
          reloadSliders();
        }
      }).addSliderSegments();
    }
    
    var $slider = $('#bolus_time_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: simt,
        step: 1,
        value: 0,
        orientation: 'horizontal',
        range: false,
        slide: function(event, ui) {
          $("#bolus_time_slider_label").text(ui.value);
        }
      }).addSliderSegments();
    }

    var $slider = $('#bolus_amount_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: 20,
        step: 0.1,
        value: 0,
        orientation: 'horizontal',
        range: "min",
        slide: function(event, ui) {
          $("#bolus_amount_slider_label").text(ui.value);
        }
      }).addSliderSegments();
    }

    var $slider = $('#tempbasal_amount_slider');
    if ($slider.length > 0) {
      $slider.slider({
        min: -0.2,
        max: 0.2,
        step: 0.001,
        value: 0,
        orientation: 'horizontal',
        range: "min",
        slide: function(event, ui) {
          $("#tempbasal_amount_slider_label").text(ui.value);
        }
      }).addSliderSegments();
    }

    var $slider = $('#tempbasal_time_slider');
    var sliderValueMultiplier = 1;
    var sliderOptions;

    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: simt,
        step: 30,
        values: [0, 30],
        orientation: 'horizontal',
        range: true,
        slide: function (event, ui) {
          $slider.find('.ui-slider-value:first')
            .text(ui.values[0] * sliderValueMultiplier)
            .end()
            .find('.ui-slider-value:last')
            .text(ui.values[1] * sliderValueMultiplier);
        }
      });

      sliderOptions = $slider.slider('option');
      $slider.addSliderSegments(sliderOptions.max)
        .find('.ui-slider-value:first')
        .text(sliderOptions.values[0] * sliderValueMultiplier)
        .end()
        .find('.ui-slider-value:last')
        .text(sliderOptions.values[1] * sliderValueMultiplier);
    }

    // Disable link clicks to prevent page scrolling
    $(document).on('click', 'a[href="#new_event_link"]', function (e) {
      e.preventDefault();
    });

    // Switches
    // if ($('[data-toggle="switch"]').length) {
    //   $('[data-toggle="switch"]').bootstrapSwitch();
    // }

    if ( userdata.stats == 1 ) {
      $('#show_statistics').bootstrapSwitch('state' , true);
    } else {
      $('#show_statistics').bootstrapSwitch();      
    }
    
    if ( userdata.inputeffect == 1 ) {
      $('#show_input_effects').bootstrapSwitch('state' , true);
    } else {
      $('#show_input_effects').bootstrapSwitch();      
    }
    
    // make code pretty
    window.prettyPrint && prettyPrint();

  });

})(jQuery);
