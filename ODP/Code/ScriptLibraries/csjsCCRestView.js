var ccRestView = {
	buildView : function(o) {
		var viewJson = o.viewJson;
		
		var columns = [];
		var columnsHead = [];
		var columnTotals = [];
		var columnCategory = [];
		var sortDefault = "";
		var sortSecond = "";
		
		for (x=0;x<viewJson.length;x++) {
	
			var column = {};
			var className = [];
			
			if (viewJson[x].enabled == "true") {
				
				if (viewJson[x].widthMax != "") {
					//style.push("max-width:" + viewJson[x].widthMax + "px")
					column.width = viewJson[x].widthMax + "px"
				}
				if (viewJson[x].width != "") {
					column.width = viewJson[x].width + "px"
				}
				if (viewJson[x].chars != "") {
					
				}
				if (viewJson[x].className != "") {
					className.push(viewJson[x].className);
				}
				
				if (viewJson[x].justify != "") {
					className.push(viewJson[x].justify+"Text");
				}
				
				column.className = className.join(" ");
				column.render = function(data,type,row,meta) {
					
					try{
						var style = [];
						if (columnsHead[meta.col].overflowHide == "true") {
							style.push("text-overflow:ellipsis");
							style.push("white-space: nowrap");
							style.push("width:" + columnsHead[meta.col].widthMax+"px");
							style.push("overflow: hidden");
						}
						
						// if this is set to (data == "") then 0 values are skipped
						if (data === "") { return "" } // No data
						
						// Put the data into an object
						// this is not the same o that is passed into the parent function
						var o = {};
						
						if (strLeft(data.toString(),1) == "{" ) { //}&& rightBack(data.toString(),1) == "}") {
							try {
								o = JSON.parse(data);
							} catch(e) {
								console.log("error parsing " + data)
								util.validateUtf8(data);
								o.value = "error parsing data";
							}
						} else {
							o.value = data;
						}
						
						// add the style key to the data object
						o.style = style;
						
						// Determine the column type and call the appropriate build function
						switch (columnsHead[meta.col].displayType) {
						case "number":
							if (type == "display") {
								return $U.formatMoney(o.value,0);
							}
							return o.value;
							break;
						case "icon":
							if (type == "display") {
								var fa = data.indexOf("class:") > -1 ? strRight(data,":") : o.icon;							
								return "<div class='center'><i class='fa " + fa + "'></i></div>";
							} else {
								return "";
							}
							break;
						case "date":
		
							if (type == "display") {
								return ccRestView.columnRender.date(o,meta);
							} else {
								return o.value;
							}
								
							break;
						case "dateTime":
							if (type == "display") {
								return ccRestView.columnRender.dateTime(o,meta);
							} else {
								return o.value;
							}
						case "currency":
							if (type == "display") {
								return ccRestView.columnRender.currency(o,meta);
							}
							try {
								var o = JSON.parse(data);
								return "$" + $U.formatMoney(data.value,0);
							} catch(e) {
								return "$" + $U.formatMoney(data,0);
							}
							
							if (isNaN(Number(data))) {
								console.log("=========================");
								console.log("$"+data);
								return "$"+data;
							}
							
							return "$" + $U.formatMoney(data,0);
							break;
						case "currencyFull":
							return "$" + $U.formatMoney(data,2);
							break;
						case "renderer":
							// parse the string
							try {
								var j = JSON.parse(data);
							} catch(e) {
								var j = data;
							}
			
							if ((typeof j) == "object") {
								// function we want to run
								var fnstring = j.renderer;
								
								// find object
								if (fnstring.indexOf('.') > -1) {
									var fn = window.getFunctionFromString(fnstring);
								} else {
									var fn = window[fnstring];
								}
								
								// is object a function?
								if (typeof fn === "function")  {
									return fn(j,type);
								} else {
									return "_error_";
								}
							} else {
								return "_error_"
							}
						default:
							if (type == "display") {	
								return ccRestView.columnRender.text(o,meta,row);
							} else if (type == "sort")  {
								// this should kick in only when this column is being sorted
								if ((typeof o.sortValue) != "undefined") {
									// return the sort value if its returned in the view json
									return o.sortValue;
								}
								return o.value;
							} else {
								return o.value;
							}
						}
					} catch(e) {
						console.log("error " + e.toString() + " : *" + data + "*" + " : " + (typeof data))
						return "_error";
					}
				}
	
				if (viewJson[x].itemName == "docid") {
					column.sClass = "docid";
				}
				column.sClass = column.className + " " + viewJson[x].itemName;
				column.data = viewJson[x].itemName;
				column.name = viewJson[x].itemName;
				column.title = viewJson[x].title; //"<div style='" + style.join(";") + "'>" + viewJson[x].title + "</div>";
				
				if (viewJson[x].hidden == "true") {
					column.visible = false;
				} 
				
				// need to pass an index into the sort object
				if (viewJson[x].itemName == o.sortDefault) {					
					sortDefault = [(columns.length),o.sortDefaultOrder];
				}
				if (viewJson[x].itemName == o.sortSecond) {					
					sortSecond = [(columns.length),o.sortSecondOrder];
				}
				
				
				// Check for totals
				viewJson[x].total == "true" ? columnTotals.push(x) : "";
				
				// Check for category
				viewJson[x].category == "true" ? columnCategory.push(x) : "";
				
				columns.push(column);
				columnsHead.push(viewJson[x])
			} 
		} // end for
		
		// Check the default sort
		var sortColumn = [];
		
		if (sortDefault != "") {
			sortColumn.push(sortDefault)
		}
	
		if (sortSecond != "") {
			sortColumn.push(sortSecond)
		}
		
		if (sortColumn != []) {
			o.sortColumn = sortColumn;
		}
		
		// return value
		o.columns = columns;
		o.columnsHead = columnsHead;
		o.columnTotals = columnTotals;
		o.columnCategory = columnCategory;
	
		return o;
	
	},	// end buildView
	submitError : function(o) {
		$.ajax({
			  type: "POST",
			  url: "/ABMS/bossrest.nsf/submitError.xsp",
			  data: o,
			  success: function() {
					console.log("success");
				}
			});
	},
	getScrollHeight : function(fh) {
		return ;
		
	},
	getTotAvgCols : function(o) {
		// return indexes and classes of total columns
		// Get any totals
		var cols = []; // array containing index number of total columns
		
		// loop through all column configs to see if any are totals
		for (x=0;x<o.columnsHead.length;x++) {
			if (o.columnsHead[x].total == "true") {	
				// if this is a total column add it to the array
				cols.push({"index":x,"class":o.columnsHead[x].itemName,"displayType":o.columnsHead[x].displayType}); 
			}
			if (o.columnsHead[x].avg == "true") {	
				// if this is a total column add it to the array
				cols.push({"index":x,"class":o.columnsHead[x].itemName,"displayType":o.columnsHead[x].displayType}); 
			}
		}
		
		return cols;
	},
	getAvg : function(o,api,footer) {
		/*on 
			o	: view configuration object
			api : api object for this DataTable
		 footer	: class of the footer for this DataTable
		*/
		
		// Get any columns that need to be averaged
		var dataIndex = []; // array containing index number of avg columns
		
		// loop through all column configs to see if any are avgs
		for (x=0;x<o.columnsHead.length;x++) {
			if (o.columnsHead[x].avg == "true") {	
				// if this is a total column add it to the array
				dataIndex.push(x); 
			}
		}	   
        
        // loop through the array that stores the total columns
		for (x=0;x<dataIndex.length;x++) {
			var total = 0;
			var count = 0;
			var vals = api.column( dataIndex[x], {search:'applied'} ).data();
			
			// loop though all cells in the column and get the total
			// not counting filtered rows
			if (api.column(dataIndex[x]).visible()) {
				for (t=0;t<vals.length;t++) {
					total += Number(vals[t]);
				}
				count = t;
			}

			// add the total to the footer cell with the correct data type
    		switch (o.columnsHead[dataIndex[x]].displayType) {
    		case "currency":
    			$("[data-column='" + dataIndex[x] + "']",$("." + footer)).html("$" + $U.formatMoney(total/count,0))
    			break;
    		default:
    			$("[data-column='" + dataIndex[x] + "']",$("." + footer)).html((total/count).toFixed(0));
    			break;
    		}

        }
	},
	getAvgColumns : function(o) {
		
		// return indexes and classes of total columns
		// Get any totals
		var avgColumns = []; // array containing index number of total columns
		
		// loop through all column configs to see if any are totals
		for (x=0;x<o.columnsHead.length;x++) {
			if (o.columnsHead[x].avg == "true") {	
				// if this is a total column add it to the array
				avgColumns.push({"index":x,"class":o.columnsHead[x].itemName,"displayType":o.columnsHead[x].displayType}); 
			}
		}
		
		return avgColumns;
	},
	getTotalColumns : function(o) {
		
		// return indexes and classes of total columns
		// Get any totals
		var totalColumns = []; // array containing index number of total columns
		
		// loop through all column configs to see if any are totals
		for (x=0;x<o.columnsHead.length;x++) {
			if (o.columnsHead[x].total == "true") {	
				// if this is a total column add it to the array
				totalColumns.push({"index":x,"class":o.columnsHead[x].itemName,"displayType":o.columnsHead[x].displayType}); 
			}
		}
		console.log("totalColumns="+totalColumns)
		return totalColumns;
	},
	isTotalColumn : function(tdClass, totalColumns) {
		for (var x=0;x<totalColumns.length;x++) {
			if (totalColumns[x].itemName == tdClass) {
				return true;
			}
		}
		return false;
	},
	getTotals : function(o,api,footer) {
		/*
		 	o	: view configuration object
		 	api	: DataTable object for this view
		 footer	: class for table footer
		 */

		// Get any totals
		var dataIndex = []; // array containing index number of total columns
		
		// loop through all column configs to see if any are totals
		for (x=0;x<o.columnsHead.length;x++) {
			if (o.columnsHead[x].total == "true") {	
				// if this is a total column add it to the array
				dataIndex.push(x); 
			}
		}	   
        
        // loop through the array that stores the total columns
		if (footer != "" && footer != null) {
		for (x=0;x<dataIndex.length;x++) {
			var total = 0;
			var vals = api.column( dataIndex[x], {search:'applied'} ).data();
			var groups = api.column( 0, {search:'applied'} ).data();

			// loop though all cells in the column and get the total
			// not counting filtered rows
			if (api.column(dataIndex[x]).visible()) {
				for (t=0;t<vals.length;t++) {
					total += Number(vals[t]);
				}
			}
			// add the total to the footer cell with the correct data type
    		switch (o.columnsHead[dataIndex[x]].displayType) {
    		case "currency":
    			$("[data-column='" + dataIndex[x] + "']",$(".panel" + o.thisView + " ." + footer)).html("$" + $U.formatMoney(total,0))
    			break;
    		default:
    			$("[data-column='" + dataIndex[x] + "']",$(".panel" + o.thisView + " ." + footer)).html(total);
    			break;
    		}
    		// setup the text-align
    		$("[data-column='" + dataIndex[x] + "']",$("." + footer)).css("text-align",o.columnsHead[dataIndex[x]].justify)
        }
		}
	},
	getFormattedValue : function(format,value) {
		switch (format) {
		case "currency":
			return ("$" + $U.formatMoney(value,0));
			break;
		default:
			return value;
			break;
		}
	},
	buildFooter : function(o) {
		
		if (o==null) { return; }
		if (o==undefined) { return; }
		console.log("=== start build footer for " + o.thisView + " ===")
		if ($(".ffDefault",$(".panel"+o.thisView)).length > 0) {
			// check to see if the info is in the footer.
			// if so, set it aside and pick it up later
			
			// MODAL FIX $(".ffDefault",$(".panel"+o.thisView)).css("max-width",$(".dataTables_scrollBody table",$(".panel"+o.thisView)).outerWidth()+"px")
			// MODAL FIX $(".ffDefault",$(".panel"+o.thisView)).css("min-width",$(".dataTables_scrollBody table",$(".panel"+o.thisView)).outerWidth()+"px")
			 return;
		}
		var cellCount = $("th",$(".panel"+o.thisView + " " + o.dataTableClass + " thead")[0]);
		footerAttachTo = o.viewport == "" ? "body" : o.viewport;
		var tableWidth = "100%"; //$(".panel"+o.thisView + " tbody").outerWidth();
		var tdCells = [];
		var rowOne = $(".panel"+o.thisView + " tbody tr");
		//console.log("rowOne length=" + $(rowOne).html())
		// create footer cells to match header
		for (x=0;x<cellCount.length;x++) {	

			cell = $("td",rowOne).length == 1 ? $("td",rowOne) : $("td",rowOne)[x]

			var paddingLR = ($(cell).outerWidth() - $(cell).width())/2 + "px";  // css("width") //$("td",rowOne).css("padding");   // ($(o.cellCount[x]).outerWidth() - $(o.cellCount[x]).width())/2 + "px";
			var border = ($(cell).outerWidth())
			tdCells.push("<td data-column='" + o.itemIndexes[x] + "' class='" + o.itemNames[x] + "Foot' style='width:" + $(cell).width() + "px;padding:" + paddingLR + "'>&nbsp;</td>");  //padding-left:" + paddingLR + ";padding-right:" + paddingLR + "
		}


		var pos = $(footerAttachTo).position();
		// get the width of the fixed header so we can apply it to
		// the footer
		width = $(footerAttachTo).css("width");
		footerAtachTo = footerAttachTo != "" ? footerAttachTo : "body";
		//console.log("attaching footer to " + footerAttachTo);
		var footerHtml = "<div class='ffDefault " + o.ffClass + "' style='width:" + width + "'><table style='width:" + tableWidth + "px' class='fixedFooterTable cell-border'><tfoot><tr>" + tdCells.join("") + "</tr></tfoot></table></div>";
		if (o.showFixedHeader) {
			width="auto"; // MODAL FIX
			var newFooter = $(".dataTables_scroll",$(".panel"+o.thisView)).after("<div class='ffDefault " + o.ffClass + "' style='width:" + width + "'><table style='width:" + tableWidth + "' class='fixedFooterTable cell-border'><tfoot><tr>" + tdCells.join("") + "</tr></tfoot></table></div>");
			$(".ffDefault",$(".panel"+o.thisView)).prepend($(".dataTables_info",$(".panel"+o.thisView)))
			$(".dataTables_info",$(".panel"+o.thisView)).css({"position":"absolute","padding":"5px","float":"none"})
		} else {
			width="auto"; // MODAL FIX
			var newFooter = $(".panelRestView",$(".panel"+o.thisView)).append("<div class='ffDefault " + o.ffClass + "' style='width:" + width + "'><table style='width:" + tableWidth + "px' class='fixedFooterTable cell-border'><tfoot><tr>" + tdCells.join("") + "</tr></tfoot></table></div>");
		}
		
		if (footerAttachTo != "body") {
		  if (pos) {
			left = $(footerAttachTo).css("position") == "relative" ? 0 : pos.left;
		  }
		}
		// MODAL FIX $(".ffDefault",$(".panel"+o.thisView)).css("max-width",$(".dataTables_scrollBody table",$(".panel"+o.thisView)).outerWidth()+"px");
		// MODAL FIX $(".ffDefault",$(".panel"+o.thisView)).css("min-width",$(".dataTables_scrollBody table",$(".panel"+o.thisView)).outerWidth()+"px");
		console.log("=== end build footer for " + o.thisView + " ===")
	},
	loading : function(mode,viewport,thisView) {
		viewport = viewport == "" ? window : viewport; 
		if (mode == "show") {

			var top = $(".panel"+thisView).offset().top+100;
			var left = $(".panel"+thisView).offset().left;
		//	var width = $(viewport).outerWidth();
		//	var height = viewport == window ? $(viewport).outerHeight() - top : $(viewport).outerHeight();
		
			$(".loading"+thisView).show();
			//$(".loading"+thisView).css({"opacity":".75","position":"fixed","top":top,"left":left,"width":width+"px","height":height+"px","z-index":10000,"background":"#fff"});
			//$(".loading"+thisView).css({"opacity":".75","z-index":10000,"background":"#fff"});
		} else {
			$(".loading"+thisView).fadeOut()
		}
	},
	reload : function(responses, o) {
		var newRows = [];
		var updatedRows = [];
		var vTable = $(o.dataTableClass).DataTable();
		var vRows = vTable.rows().data();
		
		for (var x=0;x<responses.length;x++) {
			var response = responses[x];	
			var foundMatch = false;
	
			for (var r=0;r<responses[x].length;r++) {
				foundMatch = false;
				updateRecord = false;
				for (var w=0;w<vRows.length;w++) {
					
					if (response[r]["@unid"] == vRows[w]["@unid"]) {
						foundMatch = true;
						
						// compare all columns for updates						
						for (var property in response[r]) {
						    if (response[r].hasOwnProperty(property)) {
						    	if (property.indexOf("@") == -1) {
							        if (response[r][property] !== vRows[w][property]) {
							        	if ((typeof response[r][property]) == "object") {
							        		if (response[r][property].toString() !== vRows[w][property].toString()) {
							        			//vRows[w][property] = response[r][property];
							        			vTable.row("."+vRows[w]["@unid"]).data()[property] = response[r][property];
							        			vTable.row("."+vRows[w]["@unid"]).invalidate();
							        			$("."+property, $("."+vRows[w]["@unid"])).addClass("alert-warning updateCell");
							        			updateRecord = true;
							        		}
							        	} else if (property.toUpperCase().indexOf("DATE") > -1) {
							        		// check for date
							        			
						        			if (leftBack(response[r][property],":") !== leftBack(vRows[w][property],":")) {
						        				//vRows[w][property] = response[r][property];
						        				vTable.row("."+vRows[w]["@unid"]).data()[property] = response[r][property];
						        				vTable.row("."+vRows[w]["@unid"]).invalidate();
						        				$("."+property, $("."+vRows[w]["@unid"])).addClass("alert-warning updateCell");
						        				updateRecord = true;
						        			}
							        	} else {
							        		console.log((typeof response[r][property]) + " : " + property + " : " + response[r][property] + " : " + vRows[w][property])
							        		// 	need to update row
							        		//vRows[w][property] = response[r][property];
							        		vTable.row("."+vRows[w]["@unid"]).data()[property] = response[r][property]; 
							        		vTable.row("."+vRows[w]["@unid"]).invalidate();
							        		$("."+property, $("."+vRows[w]["@unid"])).addClass("alert-warning updateCell");
							        		updateRecord = true;
							        	}
							        	
							        }
						        }
						    }
						}
						
					} else {
						
					}
				} // end for
				if (!foundMatch) {
					// this is a new row.  add record				
						vTable.rows.add([response[r]])
						newRows.push(response[r]["@unid"]);
						console.log("adding record " + response[r]["@unid"]);
				} 
				if (updateRecord) {
					updatedRows.push(response[r]["@unid"])
					console.log("updating record " + response[r]["@unid"]);
				}	
				
			} // end for
		} // end for responses
		
		sessionStorage.setItem("newRows",newRows);
		sessionStorage.setItem("updatedRows",updatedRows);				
		vTable.draw();
		//ccRestView.loading("hide",o.viewport,o.thisView);
		
		return;
		vTable.rows.add(response);
		vTable.draw();

		parent.resizeIframes();
	},
	insertSelectedRow : function(o, retData, rowObj, fn) {
		$("td",$(rowObj)).addClass("rowSelectOn");
		
		// POPULATE FIELD VALUE
		if ($(o.fldSelectedDoc).val() != "") {
			var v = $(o.fldSelectedDoc).val().split(";");
			if (v.indexOf(retData) == -1) {
				v.push(retData);
			}
			
		} else {
			var v = [];
			v.push(retData);
		}
		
		$(o.fldSelectedDoc).val(v.join(";"));
		
		if (fn != null) {
			fn();
		}
	},
	removeSelectedRow : function(o, retData, rowObj) {
		$("td",$(rowObj)).removeClass("rowSelectOn");
		
		if ($(o.fldSelectedDoc).val() != "") {
			v = $(o.fldSelectedDoc).val().split(";");
		}
		var z=[]; // new empty array
		for (var x=0;x<v.length;x++) {
			if (v[x] != retData && v[x] != "") {
				z.push(v[x])
			}
		}

		$(o.fldSelectedDoc).val(z.join(";"));
	},
	clearSelectedRows : function(o, rowObj) {
		$(o.dataTableClass + " td").each(function (index, el){
			$(this).removeClass("rowSelectOn");
		});
		
		$(o.fldSelectedDoc).val("");
	},
	getReturnData : function(o,data) {
		var retData = {}
		if (o.retColumn == "" || o.retColumn == null) {
			o.retColumn = "@unid";
		}
		if (o.retColumn.indexOf("&") > -1) {
			var v = o.retColumn.split("&");
		} else if (o.retColumn.indexOf(",") > -1) {
			var v = o.retColumn.split(",");
		} else {
			var v = [o.retColumn]
		}
		for (var x=0;x<v.length;x++) {
			retData[v[x]] = data[v[x]];
		}
		return retData;
	},
	defaultRowCallback : function(row,data,index,params,o) {
		var attr = $(row).attr("data-docid");
		
		// For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
		if (typeof attr !== typeof undefined && attr !== false) {
		  // Element has this attribute
			return;
		}
		
		// action item view on pcspDocument
		$(row).attr("data-docid",data['@unid']);
		$(row).attr("data-xpage",data[o.xpage]);

		for (var x=0;x<params.length;x++) {		
			params[x] != "@unid" ? $(row).attr("data-value-"+params[x],data[params[x]]) : "";
		}
		
		var retData = ccRestView.getReturnData(o,data);
	
		$(row).attr("data-return",JSON.stringify(retData));
		$(row).click(function(ev) {
		
			// 	Get the row data 
			var retData = $(row).attr("data-return");

			if ($("td",$(this)).hasClass("rowSelectOn")) {
							
				if (o.multiValue=="true") {
					
					if (ev.ctrlKey && ev.shiftKey) {
						// do nothing
						
					} else if (ev.ctrlKey) {
						// Remove the selected class from the selected row
						ccRestView.removeSelectedRow(o,retData,this);
						
					} else if (ev.shiftKey) {
						
						if (index > window[o.thisView].config.firstIndex) {
							
							$("."+o.dataTableClass + " tbody tr").each(function(rowIndex) {
								
								if (rowIndex >= window[o.thisView].config.firstIndex && rowIndex <= index) {
									retData = $(this).attr("data-return");
									ccRestView.insertSelectedRow(o,retData,this)
								}
							})
						} else {
							console.log("select rows " + index + " to " + window[o.thisView].config.firstIndex);
						}
					} else {
						// no keys pressed.  select this row only
						
						ccRestView.clearSelectedRows(o,this);								
						ccRestView.insertSelectedRow(o,retData,this);
						window[o.thisView].config.firstIndex = index;
					}
				} else {
					// Remove the selected class from the selected row
					ccRestView.removeSelectedRow(o,retData,this);
				}
							
			} else {
				
				if (o.multiValue!="true") {
					// Remove the selected class from all rows first
					ccRestView.clearSelectedRows(o,this);
					ccRestView.insertSelectedRow(o,retData,this);
				} else {
					// multi
					if (ev.shifKey && ev.ctrlKey) {
						
					} else if (ev.ctrlKey) {
						ccRestView.insertSelectedRow(o,retData,this);
						window[o.thisView].config.firstIndex = index;
					} else if (ev.shiftKey) {
						ccRestView.clearSelectedRows(o, this);
						
						if (index > window[o.thisView].config.firstIndex) {
							
							$(o.dataTableClass + " tbody tr").each(function(rowIndex) {
								
								if ($(this).attr("data-index") >= window[o.thisView].config.firstIndex && $(this).attr("data-index") <= index) {
									retData = $(this).attr("data-return");
									ccRestView.insertSelectedRow(o,retData,this)
								}
							})
						} else {
							console.log("select rows " + index + " to " + window[o.thisView].config.firstIndex);
						}
					} else {
						ccRestView.clearSelectedRows(o,this);
						ccRestView.insertSelectedRow(o,retData,this, function() {
							
						});
						window[o.thisView].config.firstIndex = index;
					}
					
				}
						
			}
			
		}); // end click
		
		$(row).dblclick(function() {
			
			// get the unid of the double clicked row
			var docid = $(this).attr("data-docid");
			href = location.href.split(".nsf");
			location.href=href[0]+".nsf/"+o.xpage+".xsp?documentId="+docid+"&action=editDocument";
		});
	},
	columnRender : {
		number : function(data,meta) {
			return $U.formatMoney(Number(data.value));
		},
		date : function(data,meta) {
			
			if (Array.isArray(data.value)) {
				var d = [];
				for (var x=0;x<data.value.length;x++) {
					var dt = new Date(data.value[x]).toLocaleString();
					//d.push(moment(data.value[x]).format("MM/DD/YY"));
				}
				return d.join("<br>");
			} else {
				var d = new Date(data.value).toLocaleString();  //moment(data.value);
			}
					
			switch(data.renderer) {
				default:
					return d.split(",")[0]; //d.format("MM/DD/YY")
			}

		},
		dateTime : function(data, meta) {
			var d = new Date(data.value);
			return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + " " + checkZero(d.getHours()) + ":" + checkZero(d.getMinutes()) + ":" + checkZero(d.getSeconds()); //d.toString(); //d.format('MM/DD/YY h:mm:ss a');
		},
		currency : function(data, meta) {
			switch(data.renderer) {
			default:
				if (data.value < 0) {
					return ("($" + $U.formatMoney(Number(data.value),0)+")");
				} 
				return ("$" + $U.formatMoney(Number(data.value),0));
			}
		},
		popover : function(data) {
			try {
				// replace %00 with "&#13;&#10;"
				var pop = data.popover.replace("%00","&#13;&#10;");
				var p = ((data.popover == "") || (data.popover == null)) ? "" : unescape(data.popover); //$('<div/>').text(unescape(data.popover)).html(); //escape(unescape(data.popover));
				
				
			} catch(e) {
				var p = "error"
			}
						
			return "<div title='" + data.popoverTitle + "' data-html='true' data-placement='bottom' data-toggle='popover' data-content='" + p + "'>" + data.value + "</div>"
			
		},
		text : function(data,meta,row) {
			var c = "";

			switch(data.renderer) {
			case "convertMonth":
				switch(data.value) {
				case "1":
					return "January";
					break;
				case "2":
					return "February";
					break;
				case "3":
					return "March";
					break;
				case "4":
					return "April";
					break;
				case "5":
					return "May";
					break;
				case "6":
					return "June";
					break;
				case "7":
					return "July";
					break;
				case "8":
					return "August";
					break;
				case "9":
					return "September";
					break;
				case "10":
					return "October";
					break;
				case "11":
					return "November";
					break;
				case "12":
					return "December";
					break;
				}
				break;
			default:
			
				if (data.popover != null) {
					
					return "<div style='" + data.style.join(";") + "'>" + this.popover(data) + "</div>"
				} else {
					data.style = (typeof data.style) != "undefined" ? data.style : [];
					try {
						return "<div style='" + data.style.join(";") + "'>" + ((typeof data.value) == "object" ? data.value.join("<br>") : data.value) + "</div>"
					} catch(e) {
						return "error:" + e.toString(); 
					}
				}
			} // end switch
		}, // end columnRender.text
		sort : function() {
			
		} // end columnRender.sort
	},
	groups : {
		buildGroupRows : function(o,api,rows) {
			console.dir(o)
			 // this code finds all the categories and inserts a row for each category
			 // the data-category value is assigned to each row and contains the category value which 
			 // it belongs to
			var td = $(o.dataTableClass + " tbody tr:first td",$(".panel"+o.thisView)); 
			var cells = "";
			var colspan = td.length;
			var stopColspan = false;
			var last="";
			
			// build the template to be used for group  rows
			
			if (o.groupCols.length > 0) {
				colspan = 0;
				console.log("#### " + td.length)
				$(td).each(function() {
					for (var x=0;x<(o.groupCols.length);x++) {
						
						if ($(this).hasClass(o.groupCols[x]['class'])) {
							// this is a total column
							console.log("#### "+o.groupCols[x]['class'])
							
								cells += '<td class="' + $(this).attr('class') + '_total"></td>';
								stopColspan = true;
							
						} else {
							// this is not a total column.  Increment colspan
							if (x==0) {
								if (!stopColspan) {
									colspan++;
								} else {
									//cells += '<td class="' + $(this).attr('class') + '_"></td>';
								}
							}
						}
					}
				});
			}

			for (x=0;x<o.columnCategory.length;x++) {
           	rowCount = 0;
           	
	            api.column(x, {page:'current'} ).data().each( function ( group, i ) {
	            	// Loop through the group columns
	            	// check to see if the group needs a renderer
	
	            	try {           		
				        var ooo = JSON.parse(group);
				        if (ooo && typeof ooo === "object") {
				        	// TODO
				        	var cat = columnRender.text(ooo,null,null)
				        } else {
				        	cat = group;
				        }
				        
				    } catch (e) {
				        // do nothing
				        cat = group
				    }
				    group = cat;
	            	groupAttr = "";
	            	if ((typeof $(rows).eq( i ).attr("data-category")) != "undefined") {
	            		// sub cat
	            		groupAttr = $(rows).eq( i ).attr("data-category") + group + "*"
	            		$(rows).eq( i ).attr("data-category", escape(groupAttr)); // set the detail rows
	            		$(rows).eq( i ).attr("data-category-level", x); // set the detail rows
	            	} else {
	            		// cat
	            		groupAttr = group;
	            		$(rows).eq( i ).attr("data-category", escape(group) + "*"); // set the detail rows
	            	}
	            	
	            	
	                if ( last.toString() !== groupAttr.toString() ) { //==
	                	
	                	var tr =  $(rows).eq( i );
	                	faClass = tr.hasClass("hidden") ? "fa-plus-circle" : "fa-minus-circle"; 
	                	var tdFirst = '<td colspan="' + colspan + '">'+ ccRestView.getGroupIcon() + group+'</td>' + cells;
	                	
	                    tr.before(
	                        '<tr data-category="' + escape(groupAttr) + '" class="group group-level-' + x + '">' + tdFirst + '</tr>'
	                    );
	                    trNew = tr.prev();
	              
	                    last = groupAttr; //=
	                    
	                } else {
	                	
	                }
               	for (var t=0;t<o.groupTotals.length;t++) {
                   	// determing which cell needs the total
                   	var ttt = o.api.column(o.groupTotals[t].index, {page:'current'} ).data()[rowCount];
                   	
                   	if (typeof $(".group[data-category='" + escape(groupAttr) + "']").attr("total") == "undefined") { 
                   		$(".group[data-category='" + escape(groupAttr) + "']").attr("total",ttt);
                   		$("."+o.groupTotals[t]['class']+"_total", $(".group[data-category='" + escape(groupAttr) + "']")).text(ccRestView.getFormattedValue(o.groupTotals[t].displayType, ttt));
                   	} else {
                   		$(".group[data-category='" + escape(groupAttr) + "']").attr("total",Number($(".group[data-category='" + escape(groupAttr) + "']").attr("total")) + ttt)
                   		$("."+o.groupTotals[t]['class']+"_total", $(".group[data-category='" + escape(groupAttr) + "']")).text(ccRestView.getFormattedValue(o.groupTotals[t].displayType, Number($(".group[data-category='" + escape(groupAttr) + "']").attr("total"))));
                   	} 
                   }
               	rowCount++;
               
	            } );
	           
           } // end for
		}, // end ccRestView.groups.buildGroupRows
		order : function(o) {
			// Order by the grouping
            // add a click event to each category row that hides/shows the rows that belong to that category

		    $(o.dataTableClass + " tbody tr.group",$(".panel"+o.thisView)).each(function () {
		    	$(this).click(function() {
		    		var thisCat = $(this).attr("data-category");
		    		var isHide = $(this).attr("data-hide") == 'true' ? true : false;
		    		var isExpand = $(".twistie", this).attr("class").indexOf('minus') > -1 ? false : true;
		    		
		    		var lastCat = thisCat;
		    		var lastExpanded = false;
		    		var isCat = false;
		    		
		    		$("[data-category*='" + thisCat + "']").each(function(){
		    			
		    			if (!$(this).hasClass("group") || $(this).attr("data-category") != thisCat) {
		    				// data rows and subcategories to the category that was clicked
		    				
		    				if ($(this).hasClass("group")) {
		    					lastCat = $(this).attr('data-category');
		    					lastExpanded = !isHide;
		    					isCat = true;
		    				} else {
		    					isCat = false;
		    				}
		    		
		    				if (isHide) {
		    					// if the top category clicked is isHide then all children need to be hidden
		    					$(this).attr("data-hide","true");
		    					$(this).addClass("hidden");
		    				} else {
		    					if (lastExpanded && !isCat) {
		    						// category of this data row
		    						$(this).attr("data-hide","false");
		    						$(this).removeClass("hidden");
			    					
		    					} else if (lastExpanded && isCat) {
		    						// subcategory
		    						$(this).removeClass("hidden");
		    					} else {
		    						$(this).attr("data-hide","true");
			    					$(this).addClass("hidden");
		    					}
		    				}
		    				if (isCat) {
		    					// if this is a subcategory reset the lastExpanded variable for 
		    					// the data rows
		    					lastExpanded = $('.twistie', $(this)).attr('class').indexOf('minus') > -1;
		    				}
		    			} else {
		    				// category row that was clicked
		    				lastCat = $(this).attr("data-category");
		    				
		    				var c = $(".twistie", this).attr("class");
		    				var twistie = $('.twistie',this);
		    				if (c.indexOf("plus") > -1) {
		    					twistie.removeClass(twistie.attr("data-collapsed"));
		    					twistie.addClass(twistie.attr("data-expanded"));
		    					$(this).attr("data-hide","false");
		    					lastExpanded = true;
		    				} else {
		    					$('.twistie',this).addClass($('.twistie',this).attr("data-collapsed"));
		    					$('.twistie',this).removeClass($('.twistie',this).attr("data-expanded"));
		    					$(this).attr("data-hide","true");
		    				}
		    				isHide = !isHide;
		    			}
		    		})
		    	})
		    } );
		}
	}, // end ccRestView.groups
	getGroupIcon : function() {
		//FONT AWESOME return '<i class="fa fa-minus-circle right5"></i>'
		
		// Bootstrap Gyphicons
		return '<span class="twistie glyphicon glyphicon-minus-sign right5" data-expanded="glyphicon-minus-sign" data-collapsed="glyphicon-plus-sign"></span>'
	}
};
var adminO = {
	viewdef : {
		init : function() {
			if ($('.viewDefinitionColumns tbody tr td').length > 1) {
				var tableAdmin = $('.viewDefinitionColumns').DataTable();
				tableAdmin.destroy();
			}
			var tableAdmin = $('.viewDefinitionColumns').DataTable( {
			  	paging: false,
			    searching: false,
			    ordering: false,
			    autoWidth: false,
			    initComplete : function() {
					adminO.viewdef.colorRows();
					adminO.viewdef.dragDrop();
				}
			});
		},
		dragDrop : function() {
			var tableList = $('.viewDefinitionColumns tbody').sortable({
				containerSelector: 'tr',
	
				itemSelector: 'tr',
				placeholder: '<tr class="placeholder"/>',
				start: function (event, ui) {
					
					/*
					oldIndex = ui.item.index();
					$(".fldOldIndex").val(oldIndex);
					item.appendTo($item.parent());
					_super(item);
					*/
				},
				stop: function (event, ui) {
					
					/*
					$item.removeClass("dragged").removeAttr("style");
					$("body").removeClass("dragging");
					
					// Set the index field so items can be re-arranged server side
					$(".fldNewIndex").val($item.index());
					*/
					var colOrder = [];
					$('.viewDefinitionColumns tbody tr').each(function() {
						colOrder.push($(this).attr("data-item"));
					})
					$(".fldNewIndex").val(colOrder);
					$(".btnReorder").click();
					
					adminO.viewdef.colorRows();
					
				}
			  } // end sortable
			); // end tabelList
		},
		colorRows : function() {
			$("tr.alert").each(function() {
				var v = this.className.split(" ");
				for (x=0;x<v.length;x++) {
					if (v[x] == "alert-warning") {
						$(this).css({background:"#fcf8e3"});
					}
					if (v[x] == "alert-danger") {
						$(this).css({background:"#eed3d7"});
					}
				}
	
			})
		}
	} // end adminO.viewdef
}
var $U = {
	getUrlParam : function(p) {
		p = p.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + p + "=([^&#]*)"),
	    results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	formatMoney : function(n,c,d,t) {
		// n : number to be formatted
		// c : number of decimal places
		//console.log("formatMoney=" + n + " : " + (typeof n))
		if (n === "") {
			//console.log("returning empty")
			return ""; 
		}
		if (n == 0) {
			//console.log("zero")
			return "0"; 
		}
		if (n.toString().indexOf(",") > -1) {
			//console.log("stripping ,")
			n = n.toString().split(",").join(""); // MGS update 01/24/2018 to handle values with multiple ,
		}
		n = Number(n);
		if (isNaN(n)) {
			//alert("Invalid number");
			//return;
		}
		
		//console.log("formatMoney n="+n)
	    //var c = 2; //isNaN(c = Math.abs(c)) ? 2 : c,
	    c = c == undefined ? 2 : c,
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    //console.log("i="+i)
	    j = (j = i.length) > 3 ? j % 3 : 0;
	    var val = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	    //console.log("val type="+(typeof val));
	    return val;
	    	
	}
};

function strLeft(str,sep) {
	return str.split(sep)[0]
}

function checkZero(val) {
	console.log("val="+val + " " + (typeof val))
	if (val.toString().length == 1) {
		return "0"+val;
	}
	return val;
}
//Get function from string, with or without scopes (by Nicolas Gauthier)
window.getFunctionFromString = function(string)
{
    var scope = window;
    var scopeSplit = string.split('.');
    for (i = 0; i < scopeSplit.length - 1; i++)
    {
        scope = scope[scopeSplit[i]];

        if (scope == undefined) return;
    }
    return scope[scopeSplit[scopeSplit.length - 1]];
}