Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        //Write app code here

		/*
		Uncomment to show an alert
		Ext.Msg.alert('Button', 'You clicked me');
		*/

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
			Ext.global.console.log('isDate()',date);
			if ( Object.prototype.toString.call(date) === "[object Date]" ) {
				// it is a date
				Ext.global.console.log('Looks like a date:', date);
				if ( isNaN( date.getTime() ) ) {  // d.valueOf() could also work
					Ext.global.console.log('But not a good date format, returning false');
					return false;
				}
				else {
					Ext.global.console.log('And is a valid date format');
					return true;
				}
			}
			else {
				// not a date
				Ext.global.console.log('NOT A DATE!',date);
				return false
			}
		}

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
			}else{
				Ext.global.console.log('Not valid dates:'+startDate+' , '+endDate);
			}
			return businessDaysTotal;

			//return businessDaysTotal;
//			alert('start Date:'+startDate +' endDate:'+endDate +' businessDays:'+businessDaysTotal);
			
		}
		
var date1 = new Date(2017, 04, 28);
var date2 = new Date(2017, 05, 08); // now

getBusinessDays(date1, date2);

		
		Ext.create('Rally.data.lookback.SnapshotStore', {
			context: {
				workspace: '/workspace/15956831576'
			},
			find: {
//				ObjectID: 94817414168
				ObjectID: 86637102004
			},
			sort: {
				_UnformattedID: 1
			},
			fetch: ['FormattedID', 'c_WorkItemStatus', 'Name']
		}).load({
			callback: function(records){
				// Ext.global.console.log('Record!', records[0].data.FormattedID+', '+ records[0].data.Name+', '+records[0].data.c_WorkItemStatus);
				//	reduced fields
				Ext.global.console.log('Record!', records[0].data.FormattedID+', '+records[0].data.c_WorkItemStatus);
				Ext.global.console.log('Records Retrieved!', records);
		
				
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
    webWorkerSupport = 'Web Workers ARE Supported.'
} else {
    // Sorry! No Web Worker support..
	webWorkerSupport = 'Web Workers NOT available.'
}
				var todo = records[0].data.FormattedID+' '+records[0].data.Name+'<BR>&nbsp;&nbsp; ExtJS Version:'+majorVersion +'<BR>&nbsp;&nbsp;Webworker Support:'+webWorkerSupport+'<BR><BR>Deal with accepted date being Thu Dec 31 9998:18:00:00 GMT-0600 (Central Standard .<BR>Clean up. and add story picker.<BR>Look at issue with Peer Review not showing up....Also how do we account of the work status moves forward and then moves back???<BR>  Look at commented out function in this app.js file  Then implement elapsed business days:http://stackoverflow.com/questions/3464268/find-day-difference-between-two-dates-excluding-weekend-days<BR><BR><BR>';
				var str = '';
				var myfunc = function(element, index){
					var dayFrom = new Date(records[index].data._ValidFrom);
					var dayTo = new Date(records[index].data._ValidTo);
					str += records[index].data.FormattedID+', '+records[index].data.c_WorkItemStatus+', '+dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() +'<BR>';
				};
				records.forEach(myfunc);
				var filter = function(records){
					var filteredRecs = [];
					var numberFilteredOut = 0;

					for(var i=0; i<records.length; i++){						
						var record = records[i].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i].data._ValidFrom.substr(0, records[i].data._ValidFrom.indexOf("T")) +', ' + records[i].data._ValidTo.substr(0, records[i].data._ValidTo.indexOf("T"));
						
						if(i > 0){
							var previousRecord = records[i-1].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i-1].data._ValidFrom.substr(0, records[i-1].data._ValidFrom.indexOf("T")) +', ' + records[i-1].data._ValidTo.substr(0, records[i-1].data._ValidTo.indexOf("T"));
							if(record!==previousRecord){

									var lastRec = filteredRecs[filteredRecs.length - 1].data;
									var proposedRec = records[i].data;
									if(lastRec.FormattedID===proposedRec.FormattedID && lastRec.c_WorkItemStatus===proposedRec.c_WorkItemStatus && lastRec._ValidTo.substr(0, lastRec._ValidTo.indexOf("T"))===proposedRec._ValidFrom.substr(0, proposedRec._ValidFrom.indexOf("T"))){											
											Ext.global.console.log('ARE EQUAL!! - '+lastRec.FormattedID+'=='+proposedRec.FormattedID +lastRec.c_WorkItemStatus +'==' +proposedRec.c_WorkItemStatus +lastRec._ValidTo.substr(0, lastRec._ValidTo.indexOf("T")) +'==' +proposedRec._ValidFrom.substr(0, proposedRec._ValidFrom.indexOf("T")));											
											var updateRecord = filteredRecs.pop();
											Ext.global.console.log('OLD Record:',updateRecord);
											Ext.global.console.log('updateRecord.data._ValidTo:'+updateRecord.data._ValidTo+' << proposedRec._ValidTo:'+proposedRec._ValidTo)
											updateRecord.data._ValidTo = proposedRec._ValidTo;											
											Ext.global.console.log('UPDATED updateRecord.data._ValidTo:'+updateRecord.data._ValidTo+' << proposedRec._ValidTo:'+proposedRec._ValidTo)
											updateRecord.elapsedBusinessDays = getBusinessDays(updateRecord.data._ValidFrom, updateRecord.data._ValidTo)
											Ext.global.console.log('Pushing UPDATED Record:',updateRecord);
											filteredRecs.push(updateRecord);
											
									}else{										
										Ext.global.console.log('previousRecord:'+previousRecord +' and record:'+record +'are different. pushing:'+record);
										Ext.global.console.log('NOT EQUAL'+lastRec.FormattedID +'==' +proposedRec.FormattedID +lastRec.c_WorkItemStatus +'==' +proposedRec.c_WorkItemStatus +lastRec._ValidTo +'==' +proposedRec._ValidTo);
										records[i].elapsedBusinessDays = getBusinessDays(records[i].data._ValidFrom, records[i].data._ValidTo)
										filteredRecs.push(records[i]);
									}

							}else{
								numberFilteredOut += 1;
								Ext.global.console.log(record+' and '+previousRecord+' are the same.  Skipping:str'+record+' total filtered:'+numberFilteredOut);
							}							
						}else{
							records[i].elapsedBusinessDays = getBusinessDays(records[i].data._ValidFrom, records[i].data._ValidTo)
							Ext.global.console.log('i='+i+'pushing:', records[i]);
							filteredRecs.push(records[i]);
						}				
					}

					Ext.global.console.log('Filtered Recs:',filteredRecs);	
					for(var i=0; i<filteredRecs.length; i++){			
						var dayFrom = new Date(filteredRecs[i].data._ValidFrom);
						var dayTo = new Date(filteredRecs[i].data._ValidTo);					
						Ext.global.console.log('Filtered Record:'+filteredRecs[i].data.FormattedID +', ' +filteredRecs[i].data.c_WorkItemStatus +', ' +dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() )
					}

					Ext.global.console.log('Filtered Recs:',filteredRecs);
					var out = '';
					for(var i=0; i<filteredRecs.length; i++){
						var dayFrom = new Date(filteredRecs[i].data._ValidFrom);
						var dayTo = new Date(filteredRecs[i].data._ValidTo);
						out += 'Filtered Record:'+filteredRecs[i].data.FormattedID +', ' +filteredRecs[i].data.c_WorkItemStatus +', ' +dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() +',  Elapsed Business Days:'+filteredRecs[i].elapsedBusinessDays +'<BR>';
					}
//					return filteredRecs
					Ext.global.console.log('out:'+out);
					return out;
				};

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
					autoScroll: true,
					html: filter(records)
				});								
				Ext.create('Ext.container.Viewport', {
					items: [ childPanel1, childPanel3, childPanel2 ]
				});				
			},
			scope: this
		});			


    }
});
