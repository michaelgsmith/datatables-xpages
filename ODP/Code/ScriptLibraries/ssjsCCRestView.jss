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
		try {
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
		} catch(e) {
			print ("ERROR : admin.getView() : " + e.toString());
			return [];
		}
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
		return sList
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
			try {
				// Clear any newColumn flags
				var newArr = [];
				var enabledArr = [];
				var itemObj = {};
				var i = 0;
				
				for (x=0;x<viewScope.viewCols.length;x++) {
					
					if (viewScope.viewCols[x].newColumn == true) {
							delete viewScope.viewCols[x].newColumn;
						}
					if (!viewScope.viewCols[x].hasOwnProperty("delColumn")) {
						newArr.push(viewScope.viewCols[x]);
						if (viewScope.viewCols[x].enabled == "true") {
							enabledArr.push(viewScope.viewCols[x]);
							itemObj[viewScope.viewCols[x].itemName] = i;
							i++;
						}
					}
				}
				
				docViewDef.replaceItemValue("viewJson",toJson(newArr));
				docViewDef.replaceItemValue("viewJsonEnabled",toJson(enabledArr));
				docViewDef.replaceItemValue("viewColIndexes",toJson(itemObj));
				
				// get the sort inforation
				var sortArray = admin.viewdef.getSortArray(itemObj);
				docViewDef.replaceItemValue("sortArray",toJson(sortArray))
				
				var saveFlag = docViewDef.save();
				
			} catch(e) {
				print(e.toString())
			}
		}, // end save
		beforePageLoad : function() {
			try {
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
						
					}
					match = false;
				}
				viewScope.viewCols = v.concat(addList);
			} catch(e) {
				print ("ERROR : admin.viewdef.beforePageLoad : " + e.toString())
			}
		}, // end beforePageLoad
		getSortArray : function(cols) {
			var order = "";
			var sortArray = [];
			
			// loop through the columns
			
			if (docViewDef.getItemValueString("sortDefault") != "") {
				order = docViewDef.getItemValueString("sortDefaultOrder") == 'd' ? 'desc' : 'asc';
			
				sortArray.push([cols[docViewDef.getItemValueString("sortDefault")],order]);
			}
			if (docViewDef.getItemValueString("sortSecond") != "") {
				order = docViewDef.getItemValueString("sortSecondOrder") == 'd' ? 'desc' : 'asc';
			
				sortArray.push([cols[docViewDef.getItemValueString("sortSecond")],order]);
			}
			if (docViewDef.getItemValueString("sortThird") != "") {
				order = docViewDef.getItemValueString("sortThirdOrder") == 'd' ? 'desc' : 'asc';
			
				sortArray.push([cols[docViewDef.getItemValueString("sortThird")],order]);
			}
			if (docViewDef.getItemValueString("sortFourth") != "") {
				order = docViewDef.getItemValueString("sortFourthOrder") == 'd' ? 'desc' : 'asc';
			
				sortArray.push([cols[docViewDef.getItemValueString("sortFourth")],order]);
			}
			
			return sortArray;
		}
	},// end viewdef
	createDefaultViewDef : function() {
		try {
			var vdoc:NotesDocument = database.createDocument();
			vdoc.replaceItemValue("form","adminViewDefinition");
			vdoc.replaceItemValue("key","view-definitions");
			vdoc.replaceItemValue("restPage","restServices");
			vdoc.replaceItemValue("database","*current database*~demos/fvc_develop_20201026.nsf");
			vdoc.replaceItemValue("displayView","Admin\\View Definitions");
			vdoc.replaceItemValue("server","currentserver");
			vdoc.replaceItemValue("loadOnInit","true");
			vdoc.replaceItemValue("xpage","adminViewDefinitionDoc")
			vdoc.replaceItemValue("viewJson",'[{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"text","formula":"@Trim(key:keyAdd)","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"colKey","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"Key"},{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"text","formula":"","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"displayView","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"Display View"},{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"text","formula":"","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"restService","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"REST Service"},{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"text","formula":"","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"restPage","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"REST XPage"},{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"text","formula":"","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"sortColumn","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"sortColumn"},{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"text","formula":"","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"sortOrder","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"sortOrder"},{"className":"","enabled":"true","visible":false,"sortable":"false","displayType":"dateTime","formula":"@Modified","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"colModified","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"Modified"},{"className":"","enabled":"false","visible":false,"sortable":"false","displayType":"text","formula":"","category":"false","hidden":"false","justify":null,"widthMax":"","itemName":"filter","width":"","totalValue":"false","overflowHide":"false","avg":"false","categoryRenderer":"","sortDisable":"false","total":"false","title":"filter"}]');
			vdoc.save(true, false);
			
			// open the view definition
			var ps = "location.href=location.href.split('.nsf')[0] + '.nsf/adminViewDefinitionDoc.xsp?documentId=" + vdoc.getUniversalID() + "&action=editDocument'";
			view.postScript(ps);
		} catch(e) {
			print("ERROR : admin.creatDefaultViewDef() : " + e.toString())
		}
	},
	config : {
		save : function() {
			var saveFlag = configDoc.save();
			print("saveFlag="+saveFlag);
			if (saveFlag) {
				view.postScript("alert('Configuration saved successfully.')")
			}
		}
	}
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
					if (vwDoc.getItemValueString("viewJsonEnabled") != "") {
						var viewCols = fromJson(vwDoc.getItemValueString("viewJsonEnabled"));
						var viewColIndexes = fromJson(vwDoc.getItemValueString("viewColIndexes"));
					} else {
						// legacy ... save View Definition doc to use viewJsonEnabled Value
						var tmp = fromJson(vwDoc.getItemValueString("viewJson"));
						
						var viewCols = [];
						var viewColIndexes = {};
						var i = 0; // index of enabled columns
						
						for (x=0;x<tmp.length;x++) {
					
							if (tmp[x].enabled == "true") {
								viewCols.push(tmp[x]);
								viewColIndexes[tmp[x].itemName] = i;
								i++;
							}
						}
					}
					viewScope[key] = {};
					viewScope[key].viewCols = viewCols;
					viewScope[key].viewColIndexes = viewColIndexes;
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
					viewScope[key].sortArray = ccRestView.buildSortArray(vwDoc,viewColIndexes);
					viewScope[key].sortServer = vwDoc.getItemValueString('sortServer');
					viewScope[key].sortServerOrder = vwDoc.getItemValueString('sortServerOrder');
					viewScope[key].multiSelect = vwDoc.getItemValueString('multiSelect');
					
					//applicationScope.viewdefs[key] = viewScope[key];
				} else {
					// Did not find the admin def
					viewScope[key] = {};
					view.postScript("$('.panelRestViewContainer').first().prepend('<div>Could not find View Definition " + key + ".</div><a href=\"adminViewDefinitionDoc.xsp\">Create View Definition</a>')");
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
 	buildSortArray : function(vwDoc,viewColIndexes) {
 		print("sortArray="+vwDoc.getItemValueString("sortArray"))
 		if (vwDoc.getItemValueString("sortArray") != "") {
 			return vwDoc.getItemValueString("sortArray");
 		} else {
 			// legacy sorting
			var v = [];
			var itemIndex = 0;
			
			// we need to get the indexes for the items
 			if (vwDoc.getItemValueString('sortDefault') != "") {
 				itemIndex = viewColIndexes[vwDoc.getItemValueString('sortDefault')];
 				v.push([itemIndex,vwDoc.getItemValueString('sortDefaultOrder') == "d" ? "desc" : "asc"]);
 			}
 			if (vwDoc.getItemValueString('sortSecond') != "") {
 				itemIndex = viewColIndexes[vwDoc.getItemValueString('sortSecond')];
 				v.push([itemIndex,vwDoc.getItemValueString('sortSecondtOrder') == "d" ? "desc" : "asc"]);
 			}
 			return v; 			
 		}

 	},
 	getItemIndex : function() {
 		
 	},
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