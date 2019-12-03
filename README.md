### A Flexible View Control for XPages
* A re-usable custom control and companion libraries that can be dropped into ANY Domino XPage application
* Built on jQuery and DataTables, and REST data
* Extremely versatile and configurable
* Born out of frustration with the out-of-the-box tools in XPages.
* Goals: 
    * Streamline view creation and avoid rewriting same code over and over 
    * Move management of views out of the view design element as much as possible
    * Separate logic and data 
    * Minimize view creation - no more single-use views!
<br>
<img src="https://xpagedotme.files.wordpress.com/2019/12/datatables-xpages-domino-view.jpg" />
<br>

### How It Works - View Definitions
* View Definitions are the 'wiring' for the Flexible View Control
* They are stored as Lotus Notes Documents and act as the View design for the Flexible View Control
* One View can be represented many different ways with different sorting, column orders and even categorization
* The Lotus Notes View simply acts as a table of data served via REST services
<br>
<img src="https://xpagedotme.files.wordpress.com/2019/12/flexible-view-control-how-it-works-page-1.png" />

### Getting Started
1. Clone the project into a new On Disk Project (ODP) and import into a new .nsf in Domino Designer
   1. Thomas Adrian has a quick and easy guide <a href="http://www.notessidan.se/blogg.nsf/xstart.xsp?post=C5E1282A37AC31EFC1257DCA00353318">here</a> on how to do it
1. Build the project in Domino Designer
1. Load the adminConfig.xsp to define some basic information that the view control needs to work properly
1. Create your first view definition
1. Add the ccRestView custom control to an XPage
1. Configure the ccRestView custom control to point to your view definition

### Project Assets
<table border="1" cellspacing="0" cellpadding="0" width="100%">
<tbody>
        <tr>
            <td width="200" valign="top">
                <p>
                    <b>File</b>
                </p>
            </td>
<td width="100" valign="top">
                <p>
                    <b>Type</b>
                </p>
            </td>
            <td valign="top" width="600">
                <p>
                    <b>Description</b>
                </p>
            </td>
       </tr>
<tr>
<td>
ccRestView
</td>
<td>Custom Control</td>
<td>
This is the flexible view control 
</td>
</tr>
<tr>
<td>
adminConfig.xsp
</td>
<td>XPage</td>
<td>
This XPage is used to setup some basic configuration information.  The data is stored in a Notes document. 
</td>
</tr>
</tr>
<tr>
<td>
adminViewDefinitionDoc.xsp
</td>
<td>XPage</td>
<td>
The XPage used to create View Definitions.  Each View Definition is stored in a Notes document. 
</td>
</tr>
<tr>
<td>
adminViewDefinitions.xsp
</td>
<td>XPage</td>
<td>
The XPage used to display View Definitions.  <b>Note:</b>This XPage uses the Flexible View Control!. 
</td>
</tr>
<tr>
<td>
restServices.xsp
</td>
<td>XPage</td>
<td>
Default XPage where Rest Services are located.   
</td>
</tr>
<td>
csjsCCRestView.js
</td>

<td>script</td>
<td>
Client side JavaScript library   
</td>
</tr>
<tr>
<td>
ssjsCCRestView.js
</td>
<td>script</td>
<td>
Server side JavaScript library   
</td>
</tr>
<tr>
<td>
disable_amd.js
</td>
<td>script</td>
<td>
Client side script to turn off AMD to allow scripts that use AMD (for example the DataTables source js) to load without issue.  Otherwise AMD needs to be disabled directly in the source script.  This file is utilized in the project theme.
</td>
</tr>
<tr>
<td>
enable_amd.js
</td>
<td>script</td>
<td>
Client side script to turn off AMD back on after scripts that utilize AMD are loaded.  This file is utilized in the project theme.
</td>
</tr>
<tr>
<td>
ccRestView.css
</td>
<td>stylesheet</td>
<td>
Client side script to turn off AMD back on after scripts that utilize AMD are loaded.  This file is utilized in the project theme.
</td>
</tr>
<tr>
<td>
ccRestView.theme
</td>
<td>theme</td>
<td>
Defines assets (js, css, etc.) to be loaded at runtime that are contained in the project or linked to from CDN resources (jQuery, DataTables)
</td>
</tr>
<tr>
<td>
adminViewDefinition
</td>
<td>form</td>
<td>
Underlying form associated with View Definition docs.
</td>
</tr>
<tr>
<td>
Admin\View Definitions
</td>
<td>View</td>
<td>
Underlying view associated with View Definition docs.
</td>
</tr>
<tr>
<td>
configDocument
</td>
<td>form</td>
<td>
Underlying form associated with the config document.
</td>
</tr>
<tr>
<td>
vwConfig
</td>
<td>View</td>
<td>
Underlying view associated with adminConfig document.
</td>
</tr>
</tbody>
</table>

### Custom Control Properties

<h4>
    Required Properties
</h4>
<table border="1" cellspacing="0" cellpadding="0" style="width:100%">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    <b>Property</b>
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    <b>Type</b>
                </p>
            </td>
            <td valign="top">
                <p>
                    <b>Description</b>
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    thisView
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Unique identifier for this view
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    viewKey
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Tells the control which view definition to use
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    dataTableClass
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    A CSS class name that gets applied to the DataTable and is
                    used to refer to the table programmatically
                </p>
            </td>
        </tr>
    </tbody>
</table>
<h4>
    Data Properties
</h4>
<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    <b>Property</b>
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    <b>Type</b>
                </p>
            </td>
            <td valign="top">
                <p>
                    <b>Description</b>
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    keys
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Values that will be added to the REST service query string
                    in the format of &amp;keys=&lt;keys&gt;
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    keysIsCategory
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘false’. If true, the keys value will be added
                    to the query string as &amp;category=&lt;keys&gt;
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    search
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Should be a Domino full text search query
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    queryString
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Additional parameters that will be added to the REST
                    service call
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    scroller
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘false’. When set to true the DataTable scroller
                    functional will be enabled. This is useful for larger data
                    sets as it only creates the table rows as they are needed.
                    See the DataTables documentation for more info.
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    scrollerCount
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Number
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is 0. If greater than 0 then the REST Service will
                    only call for x amount of documents. The DataTable will
                    keep calling the REST service until all records have been
                    received.
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
            </td>
            <td width="126" valign="top">
            </td>
            <td valign="top">
            </td>
        </tr>
    </tbody>
</table>
<h4>
    Properties that affect the DataTable appearance
</h4>
<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    <b>Property</b>
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    <b>Type</b>
                </p>
            </td>
            <td valign="top">
                <p>
                    <b>Description</b>
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    dataTableClassDefault
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Can be used to override the default DataTable appearance.
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showFixedHeader
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Defaults to ‘true’. Creates a fixed header that allows the
                    table to be scrolled so that the header is always visible
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    fixedHeaderClass
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    CSS class name that gets applied to the div that wraps the
                    table header. Only applies if showFixedHeader=true
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showFooter
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Defaults to ‘true’. Creates a footer at the bottom of the
                    table that remains visible when the table is scrolled
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    fixedFooterClass
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    CSS class name that gets applied to the fixed footer
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showInfo
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Defaults to ‘true’. Show or hide the datatables_info div
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    infoClass
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    CSS class name that gets applied to the datatables_info div
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    infoAttachTo
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    A jQuery selector (class or id). During the initComplete
                    event the datatables_info div will be moved to this element
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    Ordering
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘true’. Turns column sorting on/off
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showFilter
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘true’. Shows/hides the DataTable filter
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showFilterText
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘true’. Shows/hides the text next to the
                    DataTables filter field
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    filterPlaceholder
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Text that will placed in a placeholder attr for the filter
                    field
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    filterText
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    Text that can be used to replace the default DataTables
                    filter label of ‘filter’
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    filterAttachTo
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    A jQuery selector (class or id). During the initComplete
                    event the datatables_filter element will be prepended to
                    this element
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showPaging
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘false’. Turns paging on/off
                </p>
                <p>
                    <strong>PAGING CONTROLLED FROM VIEW DEF</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    attachPagerTo
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
                <p>
                    A jQuery selector (class or id). During the initComplete
                    event the datatables_info div will be moved to this element
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    showCellBorders
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘false’.
                </p>
            </td>
        </tr>
    </tbody>
</table>
<h4>
    Events
</h4>
<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    <b>Property</b>
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    <b>Type</b>
                </p>
            </td>
            <td valign="top">
                <p>
                    <b>Description</b>
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    createdRow
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    drawCallback
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    initComplete
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    loadOnInit
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Overrides the loadOnInit value in the Vew Definition. When
                    loadOnInit is true the DataTable is initialized when the
                    page loads. When false the DataTable needs to be
                    initialized by calling .build()
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    refreshInterval
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Number
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is 0. The DataTable will be reloaded every x
                    milliseconds
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    multiValue
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Boolean
                </p>
            </td>
            <td valign="top">
                <p>
                    Default is ‘false’. If true then multi selection can be
                    handled in the rowCallback
                </p>
            </td>
        </tr>
        <tr>
            <td width="162" valign="top">
                <p>
                    onError
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Text
                </p>
            </td>
            <td valign="top">
            </td>
        </tr>
    </tbody>
</table>








