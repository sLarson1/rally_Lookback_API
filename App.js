Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        //Write app code here

		/*
		Uncomment to show an alert
		Ext.Msg.alert('Button', 'You clicked me');
		*/
		
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

		//	fetch: ['FormattedID', 'Name', 'ScheduleState', 'c_WorkItemStatus']
			// reduced fields
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
				var todo = records[0].data.FormattedID+' '+records[0].data.Name+'<BR>&nbsp;&nbsp; ExtJS Version:'+majorVersion +'<BR>&nbsp;&nbsp;Webworker Support:'+webWorkerSupport+'<BR><BR>Look at issue with Peer Review not showing up....Also how do we account of the work status moves forward and then moves back???<BR> Keep Working on Filtering Update the timespan for a given workitem status so there is just a single entry with an updated validTo and validfrom.<BR>  Then implement elapsed business days:http://stackoverflow.com/questions/3464268/find-day-difference-between-two-dates-excluding-weekend-days<BR><BR><BR>';
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

Ext.global.console.log(records[0].data._ValidFrom+' , '+'Regex:'+records[0].data._ValidFrom.substr(0, records[0].data._ValidFrom.indexOf("T"))+'\n');
					for(var i=0; i<records.length; i++){						
						var record = records[i].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i].data._ValidFrom.substr(0, records[i].data._ValidFrom.indexOf("T")) +', ' + records[i].data._ValidTo.substr(0, records[i].data._ValidTo.indexOf("T"));
						
						if(i > 0){
							var previousRecord = records[i-1].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i-1].data._ValidFrom.substr(0, records[i-1].data._ValidFrom.indexOf("T")) +', ' + records[i-1].data._ValidTo.substr(0, records[i-1].data._ValidTo.indexOf("T"));
							if(record!==previousRecord){

//									var lastRec = filteredRecs[filteredRecs.length - 1].data;
									var lastRec = filteredRecs[filteredRecs.length - 1].data;
									var proposedRec = records[i].data;
									if(lastRec.FormattedID===proposedRec.FormattedID && lastRec.c_WorkItemStatus===proposedRec.c_WorkItemStatus && lastRec._ValidTo.substr(0, lastRec._ValidTo.indexOf("T"))===proposedRec._ValidFrom.substr(0, proposedRec._ValidFrom.indexOf("T"))){											
											Ext.global.console.log('ARE EQUAL!! - '+lastRec.FormattedID+'=='+proposedRec.FormattedID +lastRec.c_WorkItemStatus +'==' +proposedRec.c_WorkItemStatus +lastRec._ValidTo.substr(0, lastRec._ValidTo.indexOf("T")) +'==' +proposedRec._ValidFrom.substr(0, proposedRec._ValidFrom.indexOf("T")));											
											var updateRecord = filteredRecs.pop();
											Ext.global.console.log('OLD Record:',updateRecord);
//											updateRecord._ValidTo = proposedRec._ValidTo;		
											Ext.global.console.log('updateRecord.data._ValidTo:'+updateRecord.data._ValidTo+' << proposedRec._ValidTo:'+proposedRec._ValidTo)
											updateRecord.data._ValidTo = proposedRec._ValidTo;											
											Ext.global.console.log('UPDATED updateRecord.data._ValidTo:'+updateRecord.data._ValidTo+' << proposedRec._ValidTo:'+proposedRec._ValidTo)
											Ext.global.console.log('Pushing UPDATED Record:',updateRecord);
											filteredRecs.push(updateRecord);
											
									}else{										
										Ext.global.console.log('previousRecord:'+previousRecord +' and record:'+record +'are different. pushing:'+record);
										Ext.global.console.log('NOT EQUAL'+lastRec.FormattedID +'==' +proposedRec.FormattedID +lastRec.c_WorkItemStatus +'==' +proposedRec.c_WorkItemStatus +lastRec._ValidTo +'==' +proposedRec._ValidTo);
										filteredRecs.push(records[i]);
									}

							}else{
								numberFilteredOut += 1;
								Ext.global.console.log(record+' and '+previousRecord+' are the same.  Skipping:str'+record+' total filtered:'+numberFilteredOut);
							}							
						}else{
							Ext.global.console.log('i='+i+'pushing:'+record);
//							filteredRecs.push(record);
							filteredRecs.push(records[i]);
						}				
					}

					Ext.global.console.log('Filtered Recs:',filteredRecs);	
					for(var i=0; i<filteredRecs.length; i++){			
						var dayFrom = new Date(filteredRecs[i].data._ValidFrom);
						var dayTo = new Date(filteredRecs[i].data._ValidTo);					
						Ext.global.console.log('Filtered Record:'+filteredRecs[i].data.FormattedID +', ' +filteredRecs[i].data.c_WorkItemStatus +', ' +dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() )
					}
					return filteredRecs.join(",<BR>");
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
