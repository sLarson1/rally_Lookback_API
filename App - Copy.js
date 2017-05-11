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
				ObjectID: 94817414168
			},
			sort: {
				_UnformattedID: 1
			},

		//	fetch: ['FormattedID', 'Name', 'ScheduleState', 'c_WorkItemStatus']
			// reduced fields
			fetch: ['FormattedID', 'c_WorkItemStatus']
		}).load({
			callback: function(records){
				// Ext.global.console.log('Record!', records[0].data.FormattedID+', '+ records[0].data.Name+', '+records[0].data.c_WorkItemStatus);
				//	reduced fields
				Ext.global.console.log('Record!', records[0].data.FormattedID+', '+records[0].data.c_WorkItemStatus);
				Ext.global.console.log('Records Retrieved!', records);

				var todo = 'Work on Filtering out extraneous/duplicate records.  Then implement elapsed business days:http://stackoverflow.com/questions/3464268/find-day-difference-between-two-dates-excluding-weekend-days<BR><BR>'
				var str = ''
				var myfunc = function(element, index){
					var dayFrom = new Date(records[index].data._ValidFrom)
					var dayTo = new Date(records[index].data._ValidTo)					
					str += records[index].data.FormattedID+', '+records[index].data.c_WorkItemStatus+', '+dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() +'<BR>'
				}
				records.forEach(myfunc)
				
				var childPanel1 = Ext.create('Ext.panel.Panel', {
					title: 'Todo',
					html: todo
				});
				var childPanel2 = Ext.create('Ext.panel.Panel', {
					title: 'Story Aging Report',
					html: str
				});				
				Ext.create('Ext.container.Viewport', {
					items: [ childPanel1, childPanel2 ]
				});				
			},
			scope: this
		});			


    }
});
