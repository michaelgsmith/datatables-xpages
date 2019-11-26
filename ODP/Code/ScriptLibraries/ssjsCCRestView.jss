var admin = {
	getViewList : function() {
		var vwDb = getComponent("vwDatabase").getValue();
	
		if (vwDb == "none") { return ""; }
		if (vwDb == null) { return ""; }
	
		var db:NotesDatabase = session.getDatabase(database.getServer(),@Right(vwDb,"~"), false);	
	
		var viewList = db.getViews().toArray();
		var viewNames = ["- Select a view-"];
	
		for (x=0;x<viewList.length;x++) {
			viewNames.push(viewList[x].getName());
		}
		return viewNames.sort();
	},
	getView : function() {
		
		var vwDb = docViewDef.getItemValueString("database"); 
		var viewName = docViewDef.getItemValueString("displayView"); 
		var server = docViewDef.getItemValueString("server") == "" || docViewDef.getItemValueString("server") == "currentserver" ? database.getServer() : docViewDef.getItemValueString("server");
	
		if ((vwDb == "none") || (vwDb == null)) { return ""; }
		if ((viewName == "none") || (viewName == null) || (viewName == "")) { return ""; }

		var db:NotesDatabase = session.getDatabase(server,@Right(vwDb,"~"));
		var viewCols = [];
		var viewCol = {};
	
		var v:NotesView = db.getView(viewName);
		if (v==null) {return "";}
		var c = v.getColumns().toArray();

		for (x=0;x<c.length;x++) {
			viewCol = {};
			viewCol.title = c[x].getTitle();
			viewCol.itemName = c[x].getItemName();
			viewCol.formula = c[x].getFormula();
			viewCol.visible = false;
			viewCols.push(viewCol)
		}
	
		return viewCols;
	},
	getDatabases : function() {
		var v = @DbLookup(@DbName(),"vwConfig","config","databases");
		v = (typeof v) == "string" ? [v] : v.toArray();
		var dbList = ["*current database*|*current database*~"+@ReplaceSubstring(@DbName()[1],"\\","/")];
		for (var x=0;x<v.length;x++) {
			dbList.push(@Left(v[x],"~")+"|"+v[x]);
		}
	
		return dbList;
		
	},
	getServers : function() {
		var v = @DbLookup(@DbName(),"vwConfig","config","servers");
		v = (typeof v) == "string" ? [v] : v.toArray();
		var sList = ["*current server*|currentserver"];
		for (var x=0;x<v.length;x++) {
			sList.push(v[x]+"|"+v[x]);
		}
	
		return sList;
		
	},
	getRestPath : function() {
		var v = @DbLookup(@DbName(),"vwConfig","config","restPath");
		return (v == "" ? @ReplaceSubstring(@DbName()[1],"\\","/") : v) 
	},
	viewdef : {
		save : function() {
			print ("SAVING VIEW DEF")
			try {
				// Clear any newColumn flags
				var newArr = [];
	
				for (x=0;x<viewScope.viewCols.length;x++) {
					
					if (viewScope.viewCols[x].newColumn == true) {
							delete viewScope.viewCols[x].newColumn;
						}
					if (!viewScope.viewCols[x].hasOwnProperty("delColumn")) {
						newArr.push(viewScope.viewCols[x]);
					}
				}
	
				//viewScope.viewJson = toJson(newArr);
				docViewDef.replaceItemValue("viewJson",toJson(newArr));
				var saveFlag = docViewDef.save();
				print ("saveFlag = " + saveFlag)
				
			} catch(e) {
				print(e.toString())
			}
		}, // end save
		beforePageLoad : function() {
			try {
				print ("BEFORE PAGE LOAD")
				var url : XSPUrl;
	
				url = context.getUrl();
				var docid = url.getParameter("documentId");
	
				if (docid != "") {
					var doc:NotesDocument = database.getDocumentByUNID(docid);
					var v = [];
					v = fromJson(doc.getItemValueString("viewJson"));
					//viewScope.viewCols = v;
	
				} else {
					return;
				}
	
				var viewInfo = admin.getView();
				var match = false;
	
				for (x=0;x<v.length;x++) {
					for (y=0;y<viewInfo.length;y++) {
	
						if (viewInfo[y]["itemName"] == v[x]["itemName"]) {
							match = true;
						}
					}
					if (!match) {
						v[x].delColumn = true;
						v[x].hasOwnProperty("newColumn") ? delete v[x].newColumn  : "";
						var a = {};
						a.title = "View has been updated";
						a.body = "One or more columns have been removed from the view.  When you save the view definition they will be removed.";
						a.alertType = "danger";
						requestScope.delColumns = a;
	
					}
					match = false;
				}
	
				// Compare stored view info with actual view info
				var match = false;
				var addList = [];
	
				for (x=0;x<viewInfo.length;x++) {
					for (y=0;y<v.length;y++) {
					//print("comparing " + )
						if (viewInfo[x]["itemName"] == v[y]["itemName"]) {
							match = true;
						}
					}
					if (!match) {
						//viewInfo[x].enabled = "";
						viewInfo[x].newColumn = true;
						addList.push(viewInfo[x]);
						var a = {};
						a.title = "View has been updated";
						a.body = "One or more columns have been added or updated.";
						a.alertType = "warning";
						requestScope.newColumns = a;
						print ("adding column " + viewInfo[x].itemName);
					}
					match = false;
				}
				viewScope.viewCols = v.concat(addList);
			} catch(e) {
				print ("ERROR : admin.viewdef.beforePageLoad : " + e.toString())
			}
		} // end beforePageLoad

	}// end viewdef
};
var ccRestView = {	
	init : function() {
	 	try{
	 		applicationScope.viewdefs = null;
			// Get the view settings information
			var key = arguments[0] != null ? arguments[0] : compositeData.viewKey;
			if (key == "" || key == null) {
				return;
			}
			var getDoc = false; 
			 
			// Get the view settings information
			if (applicationScope.viewdefs == null) {
				applicationScope.viewdefs = {};
				getDoc = true;
				
			} else {
				if (applicationScope.viewdefs[key] == null) {
					getDoc = true
				}
			}
			
			if (getDoc) {
				var vwSettings:NotesView = database.getView("vwAdminViewDefinitions");
				var vwDoc = vwSettings.getDocumentByKey(key, true);
				
				if (vwDoc != null) {
					// Only include enabled columns
					var tmp = fromJson(vwDoc.getItemValueString("viewJson"));
					
					var viewCols = [];
					
					for (x=0;x<tmp.length;x++) {
				
						if (tmp[x].enabled == "true") {
							viewCols.push(tmp[x]);
						}
					}
	print("getting doc")
					viewScope[key] = {};
					viewScope[key].viewCols = viewCols;
					viewScope[key].displayView = vwDoc.getItemValueString("displayView");
					viewScope[key].tableClass = vwDoc.getItemValueString("tableClass");
					viewScope[key].viewDb = vwDoc.getItemValueString("database");
					viewScope[key].json = vwDoc.getItemValueString("viewJson");
					viewScope[key].restService = vwDoc.getItemValueString("restService");
					viewScope[key].restPage = vwDoc.getItemValueString("restPage");
					viewScope[key].xagent = vwDoc.getItemValueString("xagent");
					viewScope[key].loadOnInit = vwDoc.getItemValueString("loadOnInit");
					viewScope[key].showPager = vwDoc.getItemValueString("showPager");
					viewScope[key].retColumn = vwDoc.getItemValueString('returnColumn');
					viewScope[key].xpage = vwDoc.getItemValueString('xpage');
					viewScope[key].keyAdd = vwDoc.getItemValueString('keyAdd');
					viewScope[key].keyParams = vwDoc.getItemValueString('keyParams');
					viewScope[key].keyAddParams = vwDoc.getItemValueString('keyAddParams');
					viewScope[key].sortDefault = vwDoc.getItemValueString('sortDefault');
					viewScope[key].sortDefaultOrder = vwDoc.getItemValueString('sortDefaultOrder');
					viewScope[key].sortSecond = vwDoc.getItemValueString('sortSecond');
					viewScope[key].sortSecondOrder = vwDoc.getItemValueString('sortSecondOrder');
					viewScope[key].sortServer = vwDoc.getItemValueString('sortServer');
					viewScope[key].sortServerOrder = vwDoc.getItemValueString('sortServerOrder');
					viewScope[key].multiSelect = vwDoc.getItemValueString('multiSelect');
					//viewScope[key].query = escape(xboss.util.eval(vwDoc.getItemValueString('query')));
					print ("setting app scope for viewdef " + key)
					//applicationScope.viewdefs[key] = viewScope[key];
				} else {
					// Did not find the admin def
					throw("could not find view definition for " + key)
				}
		 	} else {
		 		//print ("getting app scope for viewdef " + key)
		 		viewScope[key] = applicationScope.viewdefs[key]
		 	}
		} catch(e) {
			print("ERROR : ccRestView.init() : " + e.toString())
		}
 
 	}, // end ccRestView.init
 	resortViewDef : function() {
 		
 		var oldSort = viewScope.viewCols;
 		var newSort = viewScope._fldNewIndex;
 		newSort = newSort != "" ? newSort.split(",") : "";
 		var newArr = [];
 		
 		for (var x=0;x<newSort.length;x++) {
 			for (var y=0;y<oldSort.length;y++) {
 				if (oldSort[y].itemName == newSort[x]) {
 					newArr.push(oldSort[y]);
 					break;
 				}
 			}
 		}
 		
 		viewScope.viewCols = newArr;
 		return;
 	}
 }; // end ccRestView