(function($){
	$.fn.extend ({
		imgSlideInput: function ( options ) {
		
			var defaults = {
				speed:							"fast",
				loop:								true,
				showPrevNext:				true,
				showTerminalBtns:			true,
				showStepBtns:				true,
				stepNumeric:					false,
				prevbtn:						".prevbtn",
				nextbtn:							".nextbtn",
				topbtn:							".topbtn",
				endbtn:							".endbtn",
				stepbtn:							".stepbtn",
				stepbtnHtml:					'<a href="#"> </a>',
				stepbtnItem:					"A",				//Outermost selector
				getValue:						true,
				itemValue:						".value",
				valueField:						"INPUT",
				currentClass:					"show",			//class name, not selector
				currentStepClass:			"highlight",		//class name, not selector
				btnDisableClass:			"disable"
			}
			var options = $.extend( defaults, options );
			
			return this.each(function() {
				var 	obj = $(this),
						o = options;
				
				var	prevbtn = obj.find( o.prevbtn ),
						nextbtn = obj.find( o.nextbtn ),
						topbtn = obj.find( o.topbtn ),
						endbtn = obj.find( o.endbtn ),
						btns = topbtn.add( endbtn ).add( prevbtn ).add( nextbtn ),
						imgGroup = obj.find("UL"),
						imgField = imgGroup.parent(),
						items = imgGroup.find("LI"),
						count = items.length,
						w = imgField.width(),
						h = imgField.height(),
						current = 0;
				var 	stepbtn;
				
				//Init			
				imgField.css({
					overflow: "hidden",
					position: "relative"
				});
				imgGroup.css({
					left: 0,
					width: w * count,
					height: h,
					padding: 0,
					margin: 0,
					position: "absolute"
				});
				items.each( function () {
					$(this).css({
						width: w - $(this).outerWidth(true) + $(this).width(),
						height: h - $(this).outerHeight(true) + $(this).height(),
						cssFloat: "left",
						styleFloat: "left"
					});
				}).first().addClass( o.currentClass );
				if( o.showStepBtns ) {
					stepbtn = obj.find( o.stepbtn );
					if( !stepbtn || !stepbtn.size() ) {
						obj.append( "<div class='" + o.stepbtn.slice(2) + "'></div>'" );
					}
					stepbtn = obj.find( o.stepbtn );
					//Add step buttons
					for(var index  = 1 ; index <= count ; index++ ) {
						stepbtn.append( o.stepbtnHtml );
						var appended = stepbtn.find( o.stepbtnItem ).last();
						if( index===1 ){
							appended.addClass( o.currentStepClass );
						}
						if( o.stepNumeric ) {
							appended.text( index );
						}
					}
				}
				if( o.getValue ) {
					input = obj.find( o.valueField );
					if( !input || !input.size() ) {
						alert( o.valueField + " cannot be find!"); 
					}
				}
				loadValue();
				refreshBtnState();
				
				//Button Event
				prevbtn.click( function(){
					slide( current-1 );
					return false;
				});
				nextbtn.click( function() {
					slide(  current + 1 );
					return false;
				} );	
				topbtn.click( function() {
					slide( 0 );
					return false;
				});
				endbtn.click( function() {
					slide( count -1 );
					return false;
				});
				stepbtn.on("click", o.stepbtnItem, function() {
					slide( stepbtn.find( o.stepbtnItem ).index( $(this) ) );
					return false;
				});
				
				//Get input value
				function loadValue() {
					if( o.getValue ) {
						input.val( items.eq( current ).find( o.itemValue ).text() );
					}
				};

				//Refresh botton state
				function refreshBtnState() {
						var disable = o.btnDisableClass;
						btns.removeClass( disable );
						if( current ===0 ) {
							topbtn.addClass( disable );
							if( !o.loop ) { prevbtn.addClass( disable );}
						}
						if( current === count -1 ) {
							endbtn.addClass( disable );
							if( !o.loop ) { nextbtn.addClass( disable );}
						}
				}
				
				//Slide animation feature
				function slide( index ) {
					if( index < 0 ) { 
						if( !o.loop ) { return; }
						index = count - 1; 
					}
					if( index >= count ) { 
						if( !o.loop ) { return; }
						index = 0; 
					}
					//Animate action
					imgGroup.stop( true, true ); 
					imgGroup.animate({
							left: '+=' + ( current - index ) * w
						},
						o.speed
					);
					current = index;
					//Current item class refresh
					items.removeClass(o.currentClass)
							.eq( index )
							.addClass( o.currentClass );
					//Add highlight to current step
					if( o.showStepBtns ) {
						stepbtn.find( o.stepbtnItem )
									.removeClass( o.currentStepClass )
									.bind( "click" )
									.eq( current )
									.addClass( o.currentStepClass )
									.unbind( "click" );
					}
					//Refresh state of buttons
					refreshBtnState();
					//Load input value
					loadValue();
				}
								
			});
		}
	});
})(jQuery);
