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

				var str = ''
				var myfunc = function(element, index){
					var dayFrom = new Date(records[index].data._ValidFrom)
					var dayTo = new Date(records[index].data._ValidTo)					
//					str += records[index].data.FormattedID
					str += records[index].data.FormattedID+', '+records[index].data.c_WorkItemStatus+', '+dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString() +'<BR>'
				}
				records.forEach(myfunc)
				
				var childPanel1 = Ext.create('Ext.panel.Panel', {
					title: 'Child Panel 1',
//					html: records[0].data.FormattedID+', '+records[0].data.c_WorkItemStatus+', '+records[0].data._ValidFrom+',  '+records[0].data._ValidTo+', '+new Date(records[0].data._ValidTo)
//					html: records[0].data.FormattedID+', '+records[0].data.c_WorkItemStatus+', '+dayFrom.toDateString()+':'+dayFrom.toTimeString()+',  '+dayTo.toDateString()+':'+dayTo.toTimeString()
					html: str
				});
				Ext.create('Ext.container.Viewport', {
					items: [ childPanel1 ]
				});				
			},
			scope: this
		});			


    }
});
