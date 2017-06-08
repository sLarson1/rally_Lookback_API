Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        //Write app code here

		/*
		Uncomment to show an alert
		Ext.Msg.alert('Button', 'You clicked me');
		*/
		
		
 		this.iterationCombobox = this.add(
		{
			xtype: 'rallyiterationcombobox',
			minWidth:385,
			listeners: {
//				ready: this._onIterationComboboxLoad,
				select: this._onIterationComboboxChanged,				
				scope: this
			},			
			renderTo: Ext.getBody().dom,
			storeConfig: {
				callback: function(records, operation, success) {
					// do something after the load finishes
					////    Ext.global.console.log('Store loaded:',records);
				},
			}
		}
		);	
		
		this.iterationStartDate = '';
		this.iterationEndDate = '';
		this.iterationID = 58371598450;


/*

MAYBE ALSO USE DAY OF THE WEEK WHEN FILTERING OUT RECORDS???????

 1 -  Get calendar days  **	WE NEED TO ACCOUNT FOR IF THE TIME SPAN IS A WEEK OR LESS
 2 - Remove the 'vestigal' days from the front and end of the block of weeks temporarily
 3 - now do calendar days /7 and get the quotient -> this is the number of 7 day weeks
 4 - number of 7 day weeks * 5[for # of days in business week] = # of business days
 5 - # of business days + 'vestigal' days from step #2 = total number of business days
 
FIX THIS FOR DATE SPANS OF LESS THAN 1 WEEK - IS THE DURATION INCLUSIVE OF START AND END?
*/
		var isDate = function (date) {
			//    //    Ext.global.console.log('isDate()',date);
			if ( Object.prototype.toString.call(date) === "[object Date]" ) {
				// it is a date
				//    //    Ext.global.console.log('Looks like a date:', date);
				if ( isNaN( date.getTime() ) ) {  // d.valueOf() could also work
					//    //    Ext.global.console.log('But not a good date format, returning false');
					return false;
				}
				else {
					//    Ext.global.console.log('And is a valid date format');
					return true;
				}
			}
			else {
				// not a date
				//    Ext.global.console.log('NOT A DATE!',date);
				return false;
			}
		};

		var getBusinessDays = function(_startDate, _endDate){
			var startDate = new Date(Date.parse(_startDate));
			var endDate = new Date(Date.parse(_endDate));
			var businessDaysTotal = -1;
			if(isDate(startDate) && isDate(endDate)){
				var leadingSaturday = 6;
				var calendarDays = (endDate - startDate)/86400000;  // convert from milliseconds to days
				var startDay = startDate.getDay();
				var endDay = endDate.getDay();
				var numberOfLeadingDays = leadingSaturday - startDay;
				var numberOfTrailingDays = endDay;
				var elapsedDaysBlock = calendarDays - numberOfLeadingDays - numberOfTrailingDays;
				var calendarWeeks = Math.floor(elapsedDaysBlock / 7);
				var businessDays = calendarWeeks * 5; // 5 business days per calendar week
				businessDaysTotal = businessDays + numberOfLeadingDays + numberOfTrailingDays;
			}/* else{
				    Ext.global.console.log('Not valid dates:'+startDate+' , '+endDate);
			} */
			return businessDaysTotal;

			//return businessDaysTotal;
//			alert('start Date:'+startDate +' endDate:'+endDate +' businessDays:'+businessDaysTotal);
			
		};

		var fixEndDate = function(record) {
//			if(record.data.c_WorkItemStatus === 'Accepted'){
			if(record.data._ValidTo.indexOf('9999-01-01') !== -1){
				Ext.global.console.log('fixEndDate',record);
				Ext.global.console.log('For:'+record.data.FormattedID+' changing date from:'+record.data._ValidTo);
				//9999-01-01
				//TODO make this dynamic based on the chosen iteration!!
				record.data._ValidTo = '2017-06-07T05:00:00.000Z';				
				Ext.global.console.log('To:'+record.data._ValidTo);
			}else{
				Ext.global.console.log('No change needed for status:'+record.data.c_WorkItemStatus);
			}
			
			return record;			
		};

		
		this.snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', {
			context: {
				workspace: '/workspace/15956831576'
			},
			find: {
				Iteration: this.iterationID 
				//US6281
//				ObjectID: 86637102004
//	TFPA 2017 - Q3 - Iteration 1(06/07/2017 - 06/27/2017) id:58371600039
//	TFPA 2017 - Q2 - Iteration 4(05/17/2017 - 06/06/2017) id:58371598450
			},
			sort: {
				_UnformattedID: 1
			},
			fetch: ['FormattedID', 'c_WorkItemStatus', 'Name', 'Iteration'],
			// this paramter filters out many records
			// that are germane to the fields we are interested in
			compress : true
		}).load({
			callback: function(records){
				Ext.global.console.log('load called! on:',this.snapshotStore);
				// //    Ext.global.console.log('Record!', records[0].data.FormattedID+', '+ records[0].data.Name+', '+records[0].data.c_WorkItemStatus);
				//	reduced fields
				//    Ext.global.console.log('Record!', records.length);
				//    Ext.global.console.log('Records Retrieved!', records);
		
				
var majorVersion;				
if (Ext.version !== undefined) {
//    majorVersion = Ext.version.substring(0, Ext.version.indexOf("."));
    majorVersion = Ext.version;
} else {
//    majorVersion = Ext.getVersion().getMajor();
    majorVersion = Ext.getVersion();
}
var webWorkerSupport;
if (typeof(Worker) !== "undefined") {
    // Yes! Web worker support!
    webWorkerSupport = 'Web Workers ARE Supported.';
} else {
    // Sorry! No Web Worker support..
	webWorkerSupport = 'Web Workers NOT available.';
}
				var todo = records[0].data.FormattedID+' '+records[0].data.Name+'<BR>&nbsp;&nbsp; ExtJS Version:'+majorVersion +'<BR>&nbsp;&nbsp;Webworker Support:'+webWorkerSupport
				+'<BR><BR>Set the iterationEndDate to the correct GMT time so we get elapsed days = 0 if status change is in the same day'
				+'<BR>Now that we have Iteration Picker dynamically change the Snapshotstore. Move all the business logic into a "config" object.  When the iteration is changed we need to create a NEW snapshot store and then supply it the same config object'
				+'<BR>Dynamically set the sprint end date and use it for fixEndDate().  Also find way to apply fixEndDate ONLY on filtered records instead all 250+ records!'
				+'<BR>Look at with workitem status changing multiple times in one day and not getting counted....Also how do we account of the work status moves forward and then moves back???'
				+'<BR>  Look at commented out function in this app.js file  Then implement elapsed business days:http://stackoverflow.com/questions/3464268/find-day-difference-between-two-dates-excluding-weekend-days<BR><BR><BR>';
				var str = '';
				var myfunc = function(element, index){
					var dayFrom = new Date(records[index].data._ValidFrom);
					var dayTo = new Date(records[index].data._ValidTo);
					str += '\n' + records[index].data.FormattedID+', '+records[index].data.c_WorkItemStatus+', '+dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() +'<BR>';
				};
				records.forEach(myfunc);
Ext.global.console.log('str',str)				;
				var filter = function(records){
					var filteredRecs = [];
					var numberFilteredOut = 0;
					
					//TODO fix this - this is needed to adjust 09-09-9999 dates on accepted records
					for(var i=0; i<records.length; i++){	
						records[i] = fixEndDate(records[i]);
					}

					for(var i=0; i<records.length; i++){		
//group by date to filter out dup recs
// then adjust the dates of the filtered records	
			
// Find US7502 with empty work item status						
if(records[i].data.FormattedID.indexOf('7502') !== -1){
	Ext.global.console.log('Found US7502:',records[i].data);
}
						var record = records[i].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i].data._ValidFrom.substr(0, records[i].data._ValidFrom.indexOf("T")) +', ' + records[i].data._ValidTo.substr(0, records[i].data._ValidTo.indexOf("T"));
//Ext.global.console.log(record);	
							
						if(i > 0){
							var previousRecord = records[i-1].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i-1].data._ValidFrom.substr(0, records[i-1].data._ValidFrom.indexOf("T")) +', ' + records[i-1].data._ValidTo.substr(0, records[i-1].data._ValidTo.indexOf("T"));
							if(record!==previousRecord){
									// current record has different id or status or truncated from date or truncated to date
									var lastRec = filteredRecs[filteredRecs.length - 1].data;
									var proposedRec = records[i].data;
									if(lastRec.FormattedID===proposedRec.FormattedID && lastRec.c_WorkItemStatus===proposedRec.c_WorkItemStatus 
									&& lastRec._ValidTo.substr(0, lastRec._ValidTo.indexOf("T"))===proposedRec._ValidFrom.substr(0, proposedRec._ValidFrom.indexOf("T"))){											
									
									// current record has the same id AND status as last filtered record.  The current record Valid From matches last filtered record Valid To
									// so update the last filtered record and change the valid to date.
									
									//    Ext.global.console.log('ARE EQUAL!! - '+lastRec.FormattedID+'=='+proposedRec.FormattedID +lastRec.c_WorkItemStatus +'==' +proposedRec.c_WorkItemStatus +lastRec._ValidTo.substr(0, lastRec._ValidTo.indexOf("T")) +'==' +proposedRec._ValidFrom.substr(0, proposedRec._ValidFrom.indexOf("T")));											
											var updateRecord = filteredRecs.pop();
											//    Ext.global.console.log('OLD Record:',updateRecord);
											//    Ext.global.console.log('updateRecord.data._ValidTo:'+updateRecord.data._ValidTo+' << proposedRec._ValidTo:'+proposedRec._ValidTo)
											updateRecord.data._ValidTo = proposedRec._ValidTo;											
											//    Ext.global.console.log('UPDATED updateRecord.data._ValidTo:'+updateRecord.data._ValidTo+' << proposedRec._ValidTo:'+proposedRec._ValidTo)
											updateRecord.elapsedBusinessDays = getBusinessDays(updateRecord.data._ValidFrom, updateRecord.data._ValidTo);
											//    Ext.global.console.log('Pushing UPDATED Record:',updateRecord);
											filteredRecs.push(updateRecord);
											
									}else{
										// add current record because the last filtered record has a different ID or work item status
										//    Ext.global.console.log('previousRecord:'+previousRecord +' and record:'+record +'are different. pushing:'+record);
										//    Ext.global.console.log('NOT EQUAL'+lastRec.FormattedID +'==' +proposedRec.FormattedID +lastRec.c_WorkItemStatus +'==' +proposedRec.c_WorkItemStatus +lastRec._ValidTo +'==' +proposedRec._ValidTo);
										records[i].elapsedBusinessDays = getBusinessDays(records[i].data._ValidFrom, records[i].data._ValidTo);
//										filteredRecs.push(records[i]);
										filteredRecs.push(records[i]);
									}

							}else{
								// This is a duplicate record.  
								// Same id + status + truncated valid from + truncated valid to as the previous record so skip it
								numberFilteredOut += 1;
								//    Ext.global.console.log(record+' and '+previousRecord+' are the same.  Skipping:str'+record+' total filtered:'+numberFilteredOut);
							}							
						}else{
							// Always save the first record because its always unique - nothing happened before it ;)
							records[i].elapsedBusinessDays = getBusinessDays(records[i].data._ValidFrom, records[i].data._ValidTo);
							//    Ext.global.console.log('i='+i+'pushing:', records[i]);
//							filteredRecs.push(records[i]);
							filteredRecs.push(records[i]);
						}				
					}

					//    Ext.global.console.log('Filtered Recs:',filteredRecs);	
					for(var i=0; i<filteredRecs.length; i++){			
						var dayFrom = new Date(filteredRecs[i].data._ValidFrom);
						var dayTo = new Date(filteredRecs[i].data._ValidTo);					
						//    Ext.global.console.log('Filtered Record:'+filteredRecs[i].data.FormattedID +', ' +filteredRecs[i].data.c_WorkItemStatus +', ' +dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() )
					}

					//    Ext.global.console.log('Filtered Recs:',filteredRecs);
					var out = '';
					for(var i=0; i<filteredRecs.length; i++){
						var dayFrom = new Date(filteredRecs[i].data._ValidFrom);
						var dayTo = new Date(filteredRecs[i].data._ValidTo);
						//out += 'Filtered Record:'+filteredRecs[i].data.FormattedID +', ' +filteredRecs[i].data.c_WorkItemStatus +', ' +dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() +',  Elapsed Business Days:'+filteredRecs[i].elapsedBusinessDays +'<BR>';
						//out += filteredRecs[i].data.FormattedID +'|' +filteredRecs[i].data.Name +'|' +filteredRecs[i].data.c_WorkItemStatus +'|' +dayFrom.toDateString()+'|'+dayTo.toDateString()+'|Elapsed Business Days:'+filteredRecs[i].elapsedBusinessDays +'<BR>';
						out += filteredRecs[i].data.FormattedID +'|' +filteredRecs[i].data.Name +'|' +filteredRecs[i].data.c_WorkItemStatus +'|' +dayFrom.toDateString()+'|'+dayFrom.toTimeString()+'|'+dayTo.toDateString()+'|'+dayTo.toTimeString()+'|Elapsed Business Days:'+filteredRecs[i].elapsedBusinessDays +'<BR>';
					}
//					return filteredRecs
					    Ext.global.console.log('out:'+out);
					return out;
				};
/* 

				var childPanel1 = Ext.create('Ext.panel.Panel', {
					title: "Todo - 'C:\\tmp\\scripts\\rally_Lookback_API'",
					autoScroll: true, 
					html: todo
				});
				var childPanel2 = Ext.create('Ext.panel.Panel', {
					title: 'Story Aging Report',
					autoScroll: true,
					html: str
				});				
				var childPanel3 = Ext.create('Ext.panel.Panel', {
					title: 'Filtered Records',
					//autoScroll: true,
					scrollFlags : {
						both: true
					},					
					html: filter(records)
				});								
				Ext.create('Ext.container.Viewport', {
					items: [ childPanel1, childPanel3, childPanel2 ]
				});		
 */
				var childPanel1 = Ext.create('Ext.panel.Panel', {
					title: "Todo - 'C:\\tmp\\scripts\\rally_Lookback_API'",
					autoScroll: true, 
					html: todo
				}); 
				var childPanel2 = Ext.create('Ext.panel.Panel', {
					title: 'Iteration',
					minHeight: 66,
					minWidth: 395,
					//height: 800,
					autoScroll: true,
					scrollFlags : {
						both: true
					},					

					items : [this.iterationCombobox ]
				});						
				var childPanel3 = Ext.create('Ext.panel.Panel', {
					title: 'Filtered Records',
					autoScroll: true,
					scrollFlags : {
						both: true
					},					
//					renderTo: Ext.getBody(),
					// Note that we use html b/c "data : filter(records)" won't work
					// try creating items with the correct 'xtype'
					html: filter(records)
				});				
			
				Ext.create('Ext.container.Viewport', {
//					layout: 'fit',
					layout: 'vbox',
					items: [childPanel1, childPanel2, childPanel3]
				});					
			},
			scope: this
		});			


    },
	_onIterationComboboxChanged: function(combo, records, obj) {
		    Ext.global.console.log('Iteration Query:',this.iterationCombobox.getQueryFromSelected()); 
		    Ext.global.console.log('Iteration displayField:',this.iterationCombobox.displayField); 
		    Ext.global.console.log('Iteration combo:',this.iterationCombobox); 
		    Ext.global.console.log('Iteration records:',records); 
		var data = records[0].data;
		this.iterationStartDate = data.formattedStartDate;
		this.iterationEndDate = data.formattedEndDate;
		this.iterationID = data.ObjectID;
		Ext.global.console.log(this.snapshotStore);
//		this.snapshotStore.reload(null);
		this.snapshotStore.load({
			scope:this,
			callback:function(records, operation, success){
				Ext.global.console.log('store reloaded!!',records);
			}
		});
	    Ext.global.console.log('Iteration Info:'+data.formattedName +'(' +data.formattedStartDate +' - ' +this.iterationEndDate +') id:' +this.iterationID ); 
		
 		var config = {
			storeConfig: {
				filters: [this.iterationCombobox.getQueryFromSelected()]
			}
		};


	}	
});
