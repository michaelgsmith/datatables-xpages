# datatables-xpages

<p>
    Required Properties
</p>
<table border="1" cellspacing="0" cellpadding="0" style="width:100%">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    Property
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Type
                </p>
            </td>
            <td valign="top">
                <p>
                    Description
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
<p>
    Data Properties
</p>
<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    Property
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Type
                </p>
            </td>
            <td valign="top">
                <p>
                    Description
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
<p>
    Properties that affect the DataTable appearance
</p>
<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    Property
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Type
                </p>
            </td>
            <td valign="top">
                <p>
                    Description
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
<p>
    Events
</p>
<table border="1" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="162" valign="top">
                <p>
                    Property
                </p>
            </td>
            <td width="126" valign="top">
                <p>
                    Type
                </p>
            </td>
            <td valign="top">
                <p>
                    Description
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
