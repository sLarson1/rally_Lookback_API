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
if (Ext.version != undefined) {
//    majorVersion = Ext.version.substring(0, Ext.version.indexOf("."));
    majorVersion = Ext.version;
} else {
//    majorVersion = Ext.getVersion().getMajor();
    majorVersion = Ext.getVersion();
}
				var todo = records[0].data.FormattedID+' '+records[0].data.Name+'<BR>ExtJS Version:'+majorVersion +'<BR> Keep Working on Filtering Update the timespan for a given workitem status so there is just a single entry with an updated validTo and validfrom.<BR>  Then implement elapsed business days:http://stackoverflow.com/questions/3464268/find-day-difference-between-two-dates-excluding-weekend-days<BR><BR><BR>';
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
//Ext.global.console.log('Regex:'+records[0].data._ValidFrom.match(/\w+\s\w+\s\d+\s\d+/)+'\n');
Ext.global.console.log(records[0].data._ValidFrom+' , '+'Regex:'+records[0].data._ValidFrom.substr(0, records[0].data._ValidFrom.indexOf("T"))+'\n');
					for(var i=0; i<records.length; i++){						
//						var record = records[i].data.FormattedID + records[i].data._ValidFrom + records[i].data._ValidTo;
//						var record = records[i].data.FormattedID + records[i].data._ValidFrom.match(/\w+\s\w+\s\d+\s\d+/) + records[i].data._ValidTo.match(/\w+\s\w+\s\d+\s\d+/);
						var record = records[i].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i].data._ValidFrom.substr(0, records[i].data._ValidFrom.indexOf("T")) +', ' + records[i].data._ValidTo.substr(0, records[i].data._ValidTo.indexOf("T"));
						
						if(i > 0){
//							var previousRecord = records[i-1].data.FormattedID + records[i-1].data._ValidFrom + records[i-1].data._ValidTo;
							var previousRecord = records[i-1].data.FormattedID +', ' +records[i].data.c_WorkItemStatus +', ' + records[i-1].data._ValidFrom.substr(0, records[i-1].data._ValidFrom.indexOf("T")) +', ' + records[i-1].data._ValidTo.substr(0, records[i-1].data._ValidTo.indexOf("T"));
							if(record!==previousRecord){
									filteredRecs.push(record);
									Ext.global.console.log('previousRecord:'+previousRecord +' and record:'+record +'are different. pushing:'+record);
							}else{
								numberFilteredOut += 1;
								Ext.global.console.log(record+' and '+previousRecord+' are the same.  Skipping:str'+record+' total filtered:'+numberFilteredOut);
							}							
						}else{
							Ext.global.console.log('i='+i+'pushing:'+record);
							filteredRecs.push(record);
						}				
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
