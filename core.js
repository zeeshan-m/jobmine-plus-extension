
/*======================================*\
l*        CONSTANTS                                               |
\*======================================*/
 var SETTINGS_GENERAL = '<table cellpadding="0" cellspacing="0"><tbody><tr><td valign="top">Login Default Page:</td><td valign="top"><select id="popupSelect"><option selected="selected" value="ap">Applications</option><option value="in">Interviews</option><option value="js">Job Search</option><option value="dc">Documents</option><option value="jl">Job Short List</option><option value="rk">Rankings</option><option value="pr">Profile</option><!-- <option value="wr">Work Report Evaluations</option> --></select></td></tr><tr><td valign="top">Load Message Off:</td><td valign="top"><input id="loadCheckbox" class="chkbox" type="checkbox"></td></tr><tr><td valign="top">Do not Show Updates:</td><td valign="top"><input id="updateCheckbox" class="chkbox" type="checkbox"></td></tr><tr><td valign="top">Remove Timer:</td><td valign="top"><input checked="checked" id="removeTimerChkbx" class="chkbox" type="checkbox"></td></tr><tr><td class="" style="color: black;" valign="top">Auto-Refresh Duration (min):<br><span id="removeTimerDetails" class="details">The time specified (minutes) would allow the page to refresh when the page is on idle. If 0 or any time above 19 minutes is specified, there will be a timer for 19 minutes to avoid the php timer.</span></td><td valign="top"><input value="0" style="background-color: white; color: black;" onkeypress="return decimalOnly(event)" class="textField" id="popupText" type="text"></td></tr></tbody></table>';
/*======================================*\
l*        FUNCTIONS                                                |
\*======================================*/

function showLoadingPopup(){
     if($("body").scrollTop() != 0){$("#whiteOverlay").css("top",0);};
	$("#popupWhiteContainer").css("display","block");	
     $("body").css("overflow","hidden");
     $("#hintmsg").css("display","none");
     $("#popupContainer").css("visibility","hidden");
}
function hideLoadingPopup(){
     $("#whiteOverlay").css("top","125px");
     $("#popupWhiteContainer").css("display","none");
     $("body").css("overflow","auto");
}
function loadPopupMsg(msg){
	$("#whitePopupMsg").html(msg);
}
function resetGlobalTimer(){
	if(GLOBAL_TIMER)
        	clearTimeout(GLOBAL_TIMER);        	
     GLOBAL_TIMER  = setTimeout(function(){window.location.href = window.location.href;},getCookieValue('AUTO_REFRESH')*60*1000);
}


/*
 *        APPLIES CORRECTED DATE SORTING FOR JOBMINE
 */ 
$.tablesorter.addParser({ 
     id: 'jobmineDates', 
     is: function(s) { 
          return false; 
     }, 
     format: function(s) { 
          //Parse Jobmines dates
          s = s.trim();
          if(s == "")         //Empty
               return 0;
          var date = s[2] == " " ? s.split(" ") : s.split("-");
          var month = parseMonth(date[1]);
          var day =    date[0];
          var year =   date[2];     
          return Date.UTC(year, month, day) ;
     }, 
     type: 'numeric' 
}); 

function applyTableSorting(path, pagetype){
     var tables = $(path);
     if (tables.size()) {
          $("table:not('.PSGROUPBOX')").css("width","100%");
          tables.each(function() {$(this).prepend($("<thead></thead>").append($(this).find("tr:first").remove()));	});
          tables.addClass("tablesorter");
          
          //Applies the sorting dependent on the page
          //CHANGE THIS IF YOU ARE ADDING MORE COLUMNS
          switch(pagetype)
          {
               case "student_app_summary":
                    tables.tablesorter( {headers: {8: { sorter: 'jobmineDates' } } } );   break;
               case "student_interviews":
                    tables.tablesorter( {headers: {4: { sorter: 'jobmineDates' } } } );   break;
               case "job_short_list":
                    tables.tablesorter( {headers: {7: { sorter: 'jobmineDates' } } } );   break;
               case 'job_search_component':
                    tables.tablesorter( {headers: {11: { sorter: 'jobmineDates' } } } );   break;
               case 'student_ranking_open':
                    tables.tablesorter( {headers: {7: { sorter: 'jobmineDates' }, 9: { sorter: 'jobmineDates' } } } );   break;
               default:
                    tables.tablesorter();   break;
          }
          tables.find("td, th").css("border-bottom","1px solid #999").css("width","auto");
     }
     return tables;
}

//Runs the function when CSS is ready, very customized
function cssReady(the_function, checkRate){checkRate = checkRate == null ? 250 : checkRate;var style = window.getComputedStyle(document.getElementById('cssLoadTest'), null).getPropertyValue("display");if(window.getComputedStyle(document.getElementById('cssLoadTest'), null).getPropertyValue("display") == "none"){the_function();}else{setTimeout(function(){cssReady(the_function)},checkRate);}}

function insertCustomHeader(){
     var header = '<div id="updateInfo" style="display:none;background-color: #f1f8fe; width: 100%; text-align: center;"><a popup="false" href="http://userscripts.org/scripts/source/80771.user.js">There is a newer version of Jobmine Plus, click to install.</a></div>';
     
     header +=     '<div id="jobminepanel" style="width:100%; height:125px; background-repeat: repeat-x;';
     header +=     'background-image: url(data:image/gif;base64,R0lGODlhAQB9AOYAAFdXmlhYm+3v+mBgoF1dnmRkorW10nJyq1panGhopWpqpnZ2rW1tqPHx9/T0+IWFtoeHt4mJuPr6/JmZwpubw7Cw0KSkyLm51WdnpKKix8PD21xcncHB2s/P4qyszdfX566uz9nZ6OXl8Nzc6tXV5qioy/X1+f39/qamybe31Ozs83t7sL2915OTvltbnZWVv2xsp8nJ34GBs4+PvOjo8Xl5r9PT5W9vqJGRvXR0rIuLuaqqzH19sbKy0bu71p2dxHh4rnFxqs3N4dvb6WNjof7+/uDg7J+fxo2NumFhoOfn8FZWmllZm39/smVlo/n5+/j4++rq8r+/2fPz+HeAt/z8/YODtO3t9OLi7ff3+t7e619fn/v7/cvL4JeXwe/v9fDw9uPj7tHR5FVVmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAABAH0AAAdsgGOCg4SFhoVLAAFMCC4bBFsDSUQFThgJCjAMN0EHOQtANSs8TTJWDxAROkgzOC0vXhMUP0cZFiglOx4gFT0GKRc+LFIcGlQCMV1CHWI2JB8hQyNaRlhhIko0USpXX2ANUw4mWVBPElxVJ0WBADs=);';
     header +=     '"><table cellspacing="0" cellpadding="0" style="background-repeat: repeat-x;';
     header +=     'background-image: url(data:image/gif;base64,R0lGODlhAQB9AOYAAFdXmlhYm+3v+mBgoF1dnmRkorW10nJyq1panGhopWpqpnZ2rW1tqPHx9/T0+IWFtoeHt4mJuPr6/JmZwpubw7Cw0KSkyLm51WdnpKKix8PD21xcncHB2s/P4qyszdfX566uz9nZ6OXl8Nzc6tXV5qioy/X1+f39/qamybe31Ozs83t7sL2915OTvltbnZWVv2xsp8nJ34GBs4+PvOjo8Xl5r9PT5W9vqJGRvXR0rIuLuaqqzH19sbKy0bu71p2dxHh4rnFxqs3N4dvb6WNjof7+/uDg7J+fxo2NumFhoOfn8FZWmllZm39/smVlo/n5+/j4++rq8r+/2fPz+HeAt/z8/YODtO3t9OLi7ff3+t7e619fn/v7/cvL4JeXwe/v9fDw9uPj7tHR5FVVmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAABAH0AAAdsgGOCg4SFhoVLAAFMCC4bBFsDSUQFThgJCjAMN0EHOQtANSs8TTJWDxAROkgzOC0vXhMUP0cZFiglOx4gFT0GKRc+LFIcGlQCMV1CHWI2JB8hQyNaRlhhIko0USpXX2ANUw4mWVBPElxVJ0WBADs=);';
     header +=     '"><tr><td valign="top"><div style="width:228px;color:white;height:88px;padding:15px;padding-left:30px;text-shadow: black -2px -2px 5px, black 2px 2px 5px;font-family:Verdana,Arial;background-image:url('+SCRIPTSURL+'/images/left.png);background-repeat:no-repeat;"><span style="font-size:30px;">Jobmine Plus</span><br/><div style="margin-left:20px;">Browse jobs your way.</div></div></td>';
     header +=     '<td valign="top"><div class="links" style="margin-top:30px;width:820px;color:#CCCCCC;font-family: Arial, Verdana;outline: none; text-decoration:none;">'; 
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+PROFILE_PAGE+'>Profile</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+DOCUMENT_PAGE+'>Documents</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+JOB_SEARCH_PAGE +'>Job Search</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+JOB_SHORT_PAGE+'>Job Short List</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+APPLICATION_PAGE+'>Applications</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+INTERVIEW_PAGE+'>Interviews</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+RANKING_PAGE+'>Rankings</a> | ';
     //header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href='+WORK_REPORT_PAGE+'>Work Report Evalutions</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href="javascript:void(0)" width="500" height="400" class="popupOpen" id="settings_nav" popup="false">Settings</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href="javascript:void(0)" width="360" height="400" class="popupOpen" id="about_nav" popup="false">About</a> | ';
     header +=     '<a style="text-shadow: black -2px -2px  5px,black 2px 2px  5px;text-decoration:none;" href="javascript:saveWarning(\'main\',null,\'_top\',\'/servlets/iclientservlet/SS/?cmd=logout\')">Logout</a>';
     header +=     '</div></td><td width="100%" valign="top"><img style="float:right;" alt="" src="'+SCRIPTSURL+'/images/waterloo_logo.png"/></td></tr></table></div>';
     
     //Popup
     header +=     "<div id='popupContainer' style='display:none;'><div id='overlay'></div><div id='popupWrapper'><div id='popupContent' style='padding: 0px !important'><span id='panelWrapper'>";
     header +=     '<div class="panels" id="Settings" style="display: block; height: 100%;"><table style="width: 100%;" cellpadding="0" cellspacing="0" height="100%"><tr><td id="settingsLeft" valign="top"><div id="settingsNav" style="padding: 30px 0px; height: 100%;"></div></td><td id="settingsRight" valign="top"><div id="popupTitle" class="title"></div><div style="color: red; margin: 10px 0pt;">This uses cookies to save the following.</div><div id="settingsContent">';
     header +=      '</div><button class="button PSPUSHBUTTON" id="saveSettings">Save and Refresh</button><button style="float: right;" class="button PSPUSHBUTTON closePopup">Cancel</button></td></tr></table></div>';
     
     //About Popup
     header +=     "<div style='display:none;padding:20px;' class='panels' id='About'><b>Jobmine Plus v"+CURRENT_VERSION/100+"</b><br/><br/><span class='details'>Written by Matthew Ng<br/><br/>Website: <a href='http://userscripts.org/scripts/show/80771' target='_blank'>http://userscripts.org/scripts/show/80771</a><br/><br/>Any problems/issues/wanted features email me at:<br/><span class='details'>Email: <a href='mailto:jobmineplus@gmail.com'>jobmineplus@gmail.com</a></span></span><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><button style='float:right;' class='button closePopup PSPUSHBUTTON'>Cancel</button></div>";
     
     header +=     "</span></div></div></div>";
     
     //White overlay
     header +=     white_overlay();
     
     //Hint Popup
     header +=     "<div id='hintmsg' style='display:none;visibility:hidden;position:absolute;' class=''><a style='cursor:pointer;' popup='false'></a><div id='description'></div><input type='checkbox' id='preventShowingChkbx'  /><div id='preventShowingText'>Never show me this again.</div></div>";
     header +=     "<div id='cssLoadTest' style='visibility:hidden;display:block;'></div>";
     $("body").prepend(header);    
}

//Adds a new settings item under settings
function addSettingsItem(name, html)
{
     if(!document.getElementById("general_"+name.toLowerCase()))
     {
          $("#settingsNav").append('<a popup="false" href="javascript:void(0)">'+name+'</a>');
          $("#settingsContent").append('<div class="settingsItem" id="settings_'+name.toLowerCase()+'">'+html+'</div>');
     }
}

/*======================================*\
l*        ALTERNATIVE UNSAFEWINDOW FUCNTIONS      |
\*======================================*/
//run js code, its ugly, runs after page loads,		RUN THIS LAST
function runJS(code){	
     window.location.href = "javascript:"+code;
}
	//Able to inject functions into the page or rewrite functions, DOES NOT RUN IF runJS IS EXECUTED BEFORE, bruteforce forces the function to be set even if unsafeWindow is supported
function injectFunction(_function,bruteforce){
     $('body').append('<script language="javascript">function '+_function+'</script>');
}

/*======================================*\
l*        START OPERATION                                      |
\*======================================*/                      
function startOperation()
{
     //if(this page and do stuff)
     {
/*======================================*\
l*        PAGE CLEAN UP                                           |
\*======================================*/
          //Get page type and add a class to body
          var pagetype = $('title').html() ? $('title').html().toLowerCase().replace(/\s|-/gi,"_").replace(/_+/gi,"_") : "none";
          $("body").addClass(pagetype);

          // Insert navigation header at the top and overlays
          if(pagetype != "jobmine_|_university_of_waterloo"){insertCustomHeader();}
          
          // Add a CSS stylesheets
          var style = document.createElement( "style" ); 
          style.appendChild( document.createTextNode("@import '"+SCRIPTSURL+"/css/style2.css';") );
          if(getCookieValue('HIDE_UPDATES') != 1){style.appendChild( document.createTextNode("@import '"+SCRIPTSURL+"/css/update.css';") );};
          document.getElementsByTagName( "body" ).item(0).appendChild( style );	
          
          //Adds current version to the body class
          $('body').addClass("v"+CURRENT_VERSION);
          
          //Removing useless parts
          $("#WAIT_main0").remove();
          $("#WAIT_main").remove();
          
          //Makes all View buttons to the next tab
          $("a.PSHYPERLINK:contains('View')").attr("target","_blank");
          
     //SPECIFIC PAGE LAYOUTS
          $(".PSLEVEL1GRID.tablesorter").attr("cellpadding",0);
          $('.PSLEVEL1GRID').parent().addClass("tablepanel");
          $("table a.PTBREADCRUMB").parents("table").remove();

          if(pagetype != "student_data" ){$(".PSACTIVETAB").parents().eq(2).remove();}
          
          //For iframes! :D
          $("body").append("<script language='javascript'>function runIframeFunction(name,_function){window.frames[name].eval(_function);}</script>");
/*======================================*\
l*        JOB SEARCH PAGE                                       |
\*======================================*/
          if(pagetype == "job_search_component")            
          {
               //Write the current term in cookies if it is specified  
               if($("#UW_CO_JOBSRCH_UW_CO_WT_SESSION")[0].value.trim() != ""){ writeCookie("CURTERM", $("#UW_CO_JOBSRCH_UW_CO_WT_SESSION")[0].value.trim());}
               
               var tableBody = null;
               if(!$("form > span").html() || $("form > span").html().search(/Lookup/i) == -1)
               {
                    $('form > table > tbody > tr:first-child > td:first-child').html("<div style='margin-bottom:30px;' class='PAPAGETITLE'><span style='position:absolute;margin-left:10px;'>Job Search Criteria</span></div>");
                    //Fix the width of the page
                    $('form > table').css('width',0);
                    $('form > table').removeAttr('width');
                    $('form > table > tbody > tr:first-child > td').eq(-2).remove();
                    //move the application text to the second table
                    var searchTable = $('form > table > tbody > tr').eq(-2).html();
                    var appsRemaining = "<span class='PSEDITBOXLABEL'>"+$('form > table > tbody > tr').eq(21).html().replace(/<.*?>|\n/gi,"");    
                    var number = $('form > table > tbody > tr').eq(22).html().replace(/<.*?>|\n/gi,"");
                    appsRemaining = "<div class='PSTEXT' style='margin-bottom:15px;'><span style='position:absolute;margin-left:10px;'>"+appsRemaining.replace("(","</span>  "+number+"  (")+"</span></div>";
                    //Remove left over tr's and fix layouts
                    $('form > table > tbody > tr').eq(21).remove();
                    $('form > table > tbody > tr').eq(21).remove();    
                    $('form > table > tbody > tr').eq(-2).remove();
                    $('form > table > tbody > tr').eq(-2).remove();
                    $('form > table > tbody > tr:last-child').remove();
                    $('table.PSGROUPBOX').parent().prev().attr("colspan",2).parent().prev().children(":first-child").attr("height","30");
                    $('form:last').append("<table id='searchTable' cellspacing='0' cellpadding='0'><tr><td>"+appsRemaining+"</td></tr>"+searchTable+"</table>").css("margin-bottom","30px");              //full width table
               
                    //Playing with the table
                    tableBody = $("#searchTable tr tr:eq(1) td.tablepanel table.PSLEVEL1GRID tr");
                    if(tableBody.length > 2)
                    {
                         tableBody.each(function(row){ var obj = $(this).children();          
                         //HEADER
                              if(row == 0)   
                              {
                                   //Tells the table that the results are up
                                   $(this).parent().parent().addClass("results");
                                   
                                   //Adds new columns (status and hiring)
                                   obj.eq(0).before("<th class='PSLEVEL1GRIDCOLUMNHDR' align='left' scope='col'>Status</th>");
                                   obj.eq(8).after("<th title='You must be skilled to get the job, this is equation does not included your skill level.' class='PSLEVEL1GRIDCOLUMNHDR' align='left' scope='col'>Hiring Chances*</th>");
                              }
                         //CELLS
                              else      
                              {
                                    /*
                                    *   ADD THE STATUS COLUMN
                                    */
                                   var jobStatus = obj.eq(0);
                                   jobStatus.before("<td class='PSLEVEL1GRIDODDROW' align='left'>"+(obj.eq(6).find("div:contains('Already Applied')").length == 0 ? "New" : "Applied")+"</td>");
                               
                                   /*
                                    *   ADD THE HIRING CHANCES     
                                    */                                      
                                   var numApps = obj.eq(8);
                                   /*   Reading Purposes
                                        var openings = parseInt(obj.eq(5).html());
                                        var applications = parseInt(isNaN(parseInt(numApps.html()+1)) ? 1 : parseInt(numApps.html()+1));
                                   */
                                   numApps.after("<td title='You must be skilled to get the job, this is equation does not included your skill level.' class='PSLEVEL1GRIDODDROW' align='left'>"+Math.round((parseInt(obj.eq(5).html())/parseInt(isNaN(parseInt(numApps.html()+1)) ? 1 : parseInt(numApps.html()+1)))*10000)/100+"%</td>");
                                   
                                   if(obj.eq(7).children().html().trim() == "&nbsp;"){
                                        obj.eq(7).children().html("Not Able to Shortlist").attr("title","Jobmine has a thing where if you delete a job from shortlist, you cannot shortlist the job again. Sorry.");
                                   }
                                   
                                   /*
                                    *   ADD THE GOOGLE MAPS AND SEARCHES
                                    */ 
                                   var company = obj.eq(2).html().trim();
                                   var location = obj.eq(4).html().trim();
                                   
                                   //This is the Google search for the company
                                   obj.eq(2).wrapInner("<a class='googleSearch' title='Google Search that Company!!!'  target='_blank' href='http://www.google.ca/#hl=en&q="+company.replace(/\s/g,"+")+"'/>");            
                                   //This is for google map the location
                                   obj.eq(4).wrapInner("<a class='mapsSearch' title='Google Maps that Company!!!'  target='_blank' href='http://maps.google.ca/maps?hl=en&q="+company.replace(/\s/g,"+")+"+"+location.replace(/\s/g,"+")+"+"+$("#UW_CO_JOBSRCH_UW_CO_LOCATION").attr("value").replace(/\s/g,"+")+"'/>"); 
                                   
                                   /*
                                    *   CHANGE JOB DESCRIPTIONS
                                    */                  //Jobs appear as a tab now and it doesnt need to be refreshed                                  
                                   obj.eq(1).find("a").attr("href","https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&UW_CO_JOB_ID="+obj.eq(0).html().trim()).attr("target","_blank");
                              }         
                         });
                    }
                    
                    //Set the search visited when it ready
                    function setReadyVisited()
                    {
                         var totalRows = tables.find("tr");
                         if(totalRows.length > 2)           //Make sure the table isnt empty
                         {
                              //Each row
                              totalRows.each(function(row){
                                   if(row != 0)
                                   {
                                        /*
                                         *        VISITED LINK
                                         */
                                        var jobDescLink = $(this).children().eq(2).find("a");
                                        
                                        if(window.getComputedStyle(jobDescLink[0], null).getPropertyValue("color") == "rgb(0, 0, 254)")
                                        {
                                             //Change the color of the text and the 
                                             jobDescLink.css("color","#0000FF").parent().parent().parent().addClass("visited");
                                             
                                             //If you have not applied for the job, change the status
                                             if(jobDescLink.parent().parent().parent().find("td:first-child").html() != "Applied")
                                             {
                                                  jobDescLink.parent().parent().parent().find("td:first-child").html("Viewed");                                             
                                             }
                                        }
                                        /*
                                         *        NEW/UNVISITED LINK
                                         */
                                        else{
                                             jobDescLink.click(function(){
                                                  $(this).css("color","#0000FF").parent().parent().parent().addClass("visited").find("td:first-child").html("Viewed");
                                                  tables.trigger("update");                                             
                                             });
                                        }
                                        tables.trigger("update");
                                   }
                              });
                         }
                    }
                    
                    var tables = applyTableSorting("table table table.PSLEVEL1GRID",pagetype);
                    $("body > form > table").css("width","auto");
               }else{
                    $("form").css("margin-bottom","20px");
               }
          }
/*======================================*\
l*        PROFILE PAGE                                            |
\*======================================*/
          else if(pagetype == "student_data" && $("form > table:last-child").html()) 
          {
               var tables = applyTableSorting("table table table.PSLEVEL1GRID" , pagetype);
               var bottomNav = $("form > table:last-child").html();
               /*======================================*\
               l*        TERM CARDS                                              |
               \*======================================*/
               if(bottomNav.indexOf("Term Cards |") != -1){
                    $("form > table > tbody >tr:first-child > td:last-child").attr("width",1);
                    $("form > table > tbody >tr:first-child > td:last-child > img").attr("width",1);
                    $("form > table > tbody >tr:first-child > td:first-child").attr("width",1);
                    $("form > table > tbody >tr:first-child > td:first-child > img").attr("width",1);
                    $("body form table").eq(1).children().children().eq(2).children(":first-child").attr("height",1);        
               }
               /*======================================*\
               l*        STUDENT PERSONAL INFO & ACADEMIC INFO    |
               \*======================================*/
               else if(bottomNav.indexOf("Student Personal Info |") != -1 || bottomNav.indexOf("Acad Info. |") != -1){
                    $("body form table").css("margin","0 auto");
                    $("body form table").eq(-2).css("width","auto");          
               }
               /*======================================*\
               l*        SKILLS INVENTORY                                      |
               \*======================================*/
               else if(bottomNav.indexOf("| \nSkills Inventory") != -1){
                    $("form table td").find("label:contains('Student ID:')").parent().attr("colspan",3).css("padding-left","10px");			
                    $("form table td.tablepanel table").css("margin","0 auto").css("width","auto");
                    $("body form table").eq(-2).css("text-align","center");
                    $("textarea").css("width","100%").attr("cols","").parent().append("<br/><br/>");
                    if(ISFIREFOX){
                         $("form table td.tablepanel").attr("colspan",20);
                    }else{
                         $("body > form:last > table > tbody > tr").eq('11').children(':last').attr("colspan","14");
                    }
               }
               /*======================================*\
               l*        LOOK UP PAGESS                                        |
               \*======================================*/
               if($("form span").html() && $("form span").html().search(/Lookup.*ID/ig) == -1){
                    $("body form table:first").css("width","auto").css("margin","0 auto");
               }else{
                    $("form:last").css("margin-bottom","20px");
               }
          }
/*======================================*\
l*        DOCUMENTS PAGE                                       |
\*======================================*/
          else if(pagetype == "resumes"){                
               $("form table tr:eq(3)").children().eq(1).attr("colspan",20);
               $("form > table > tbody > tr:last-child > td:first-child").attr("height",10);    
               var resumeTable = $("form table tr:eq(5)").remove().children().eq(1).html();
               $("form:last").append(resumeTable);

               var tables = applyTableSorting("table table.PSLEVEL1GRID" , pagetype);
               $("body > form > table").eq(0).css("width","auto");
          }
/*======================================*\
l*        JOB SHORT LIST PAGE                                  |
\*======================================*/
          else if(pagetype == "job_short_list")
          { 
               window.scrollTo(0,0);
               $(".PAERRORTEXT").html("(You can remove multiple jobs by checking the rows off and clicking 'Delete Selected' or use the minus button ( - ) to remove jobs from your list.)");
               
               var numOfChkbx = 0;
               //Adding columns to tables:
               //   Added checkboxes 
               //   Added the google search and map feature
               $("body > form > table td.tablepanel table.PSLEVEL1GRID tr:last-child td tr").each(function(row){        
                    var obj = $(this);
                    var child = obj.children();
                    if(row == 0)   //Header
                    {   
                         obj.prepend('<th align="LEFT" class="PSLEVEL1GRIDCOLUMNHDR" scope="col">&nbsp;</th>');
                    }
                    else      //Body
                    {
                         //Add checkboxes
                         obj.prepend('<td align="center" height="19" class="PSLEVEL1GRIDODDROW"><input class="editChkbx" row="'+numOfChkbx+'" id=chkbx'+(numOfChkbx++)+' type="checkbox"></td>');
                         
                         //Add company and location href
                         var company = child.eq(2).html().trim();
                         var location = child.eq(4).html().trim();                         
                         child.eq(2).wrapInner("<a class='googleSearch' title='Google Search that Company!!!' target='_blank' href='http://www.google.ca/#hl=en&q="+company.replace(/\s/g,"+")+"'/>");            
                         child.eq(4).wrapInner("<a class='mapsSearch' title='Google Maps that Company!!!' target='_blank' href='http://maps.google.ca/maps?hl=en&q="+location.replace(/\s/g,"+")+"+"+company.replace(/\s/g,"+")+"'/>"); 
                         
                         //Change the hyperlink for the job descriptions
                         child.eq(1).find("a").attr("href","https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&UW_CO_JOB_ID="+child.eq(0).html().trim()).attr("target","_blank");
                    }    
               });
               //Add invisible iframe
               $("body").append("<iframe style='display:none;' name='hiddenIframe' id='hiddenIframe' width='100%' height='400' src=''></iframe>");  
               
               //Add the buttons that auto select/deselect the checkboxes
               $("#UW_CO_JSLIST_VW_").parent().parent().html("<td valign='top' height='30' colspan='13'><button class='deleteSelectedButton PSPUSHBUTTON' total='"+numOfChkbx+"' onclick='return false'>Delete Selected</button><button onclick='return selectAllChkbx(false,"+numOfChkbx+")' class='PSPUSHBUTTON'>Unselected All</button><button onclick='return selectAllChkbx(true,"+numOfChkbx+")' class='PSPUSHBUTTON'>Select All</button></td>");
               $("form > table > tbody > tr").eq(7).after("<tr><td valign='top' height='30' colspan='13'><button class='deleteSelectedButton PSPUSHBUTTON' total='"+numOfChkbx+"' onclick='return false'>Delete Selected</button><button onclick='return selectAllChkbx(false,"+numOfChkbx+")' class='PSPUSHBUTTON'>Unselected All</button><button onclick='return selectAllChkbx(true,"+numOfChkbx+")' class='PSPUSHBUTTON'>Select All</button></td></tr>");
               var tables = applyTableSorting("table table table.PSLEVEL1GRID" , pagetype);
               
               /*======================================*\
               l*        MULTISELECT CHECKBOXES                           |
               \*======================================*/
               
               //Binds so that the ids of the table are reset everytime
               tables.bind("sortEnd", function()
               {
                    tables.find("input").each(function(order){
                         $(this).attr("id","chkbx"+order);
                    });
                    anchorChkbox = null;
               });
               
               var anchorChkbox = null;
               var shiftDown = false;
               $(document).keydown(function(evt){if(evt.shiftKey){evt.preventDefault();shiftDown = true;}});
               $(document).keyup(function(evt){if(evt.keyCode == '16'){evt.preventDefault();shiftDown = false;}});
               $(".editChkbx").click(function(evt)
               {
                    var obj = $(this);
                    var row = parseInt(obj.attr("id").substr(obj.attr("id").indexOf("chkbx")+5));     
                    //If shift held, the anchor is set, and the checkbox is not the same as the last clicked
                    if(shiftDown && anchorChkbox != null && row != anchorChkbox)
                    {
                         if(anchorChkbox < row)        //Sees if you are going from down up or up down
                         {
                              for(var i=anchorChkbox; i<=row;i++){$("#chkbx"+i).attr("checked",obj.is(':checked'));}
                         }
                         else
                         {
                              for(var i=anchorChkbox; i>row;i--){$("#chkbx"+i).attr("checked",obj.is(':checked'));}
                         }
                    }   
                    anchorChkbox = row;                   
               });
               
               /*======================================*\
               l*        MULTIJOB REMOVAL                                     |
               \*======================================*/
               $('.deleteSelectedButton').click(function(){                 
                    var numChkbx = $(this).attr('total');
                    var iframeArray = new Array();
                    //Get the checkboxes in an array
                    tables.find("input").each(function(){
                         if($(this).attr("checked")){iframeArray.push($(this).attr("row"));}
                    });
                    iframeArray.sort(function(a,b){return a-b;});
                    var iframeCounter = iframeArray.length;
                    if(iframeCounter == 0){return false;}    //if nothing is selected
                    var answer = confirm (iframeCounter < 10 ? "Do you wish to delete the checked rows from this page? The page itself will refresh after the transaction is saved." : "Do you wish to delete the checked rows from this page? You have "+iframeCounter+" rows to delete and this may take a while. The page itself will refresh after the transaction is saved.");
                    if(!answer){return false;}    //if nothing is selected
                    $("#hiddenIframe").attr("src","servlets/iclientservlet/SS/?ICType=Panel&Menu=UW_CO_STUDENTS&Market=GBL&PanelGroupName=UW_CO_JOB_SLIST&RL=&target=main0&navc=5170"); 
                    loadPopupMsg("Each job removed needs to be refreshed, this will take a while because of Jobmine slowness.<br/><span style='color:blue;font-size:20px;'>*Refresh to Cancel*</span><br/>Starting...");
                    $("title").html("Job Short List | Starting...");
                    $("#popupWhiteContainer").css("display","block");
                    $("#popupWhiteContent").css("top","-150px");
                    $("#whiteOverlay").css("top","0px");
                    $("body").css("overflow","hidden");
                    $("#hiddenIframe").load(function(){          //Refresh recursive function
                         if(iframeArray.length != 0){   //Start counting and removing
                              var progress = (iframeCounter - iframeArray.length+1)+"/"+iframeCounter;
                              $("title").html("Job Short List | Removing: "+progress);
                              loadPopupMsg("Each job removed needs to be refreshed, this will take a while because of Jobmine slowness.<br/><span style='color:blue;font-size:20px;'>*Refresh to Cancel*</span><br/>Progress: "+progress);
                              if(ISFIREFOX){
                                   unsafeWindow.runIframeFunction("hiddenIframe","submitAction_main0(document,'main0','UW_CO_STUJOBLST$delete$"+(iframeArray.pop())+"$$0')");				
                              }else{
                                   runJS('runIframeFunction("hiddenIframe","submitAction_main0(document.main0,\'UW_CO_STUJOBLST$delete$'+(iframeArray.pop())+'$$0\')")');	
                              }
                         }
                         else if(iframeCounter > 0){     //Save 
                              loadPopupMsg("Each job removed needs to be refreshed, this will take a while because of Jobmine slowness. <br/><span style='color:red'>Saving now... Do not refresh.</span>");
                              $("title").html("Job Short List | Saving...");
                              iframeCounter = -1;      // go to next step
                              if(ISFIREFOX){
                                   unsafeWindow.runIframeFunction("hiddenIframe","submitAction_main0(document,'main0', '#ICSave')");
                              }else{
                                   runJS('runIframeFunction("hiddenIframe","submitAction_main0(document.main0, \'#ICSave\')")');
                              }
                         }
                         else if(iframeCounter == -1){       //Just refresh the page itself
                              window.location = JOB_SHORT_PAGE;                              
                         }
                    });
                    return false;
               });
               //Functions for the buttons to do stuff     		
               if(ISFIREFOX){
                    unsafeWindow.selectAllChkbx = function(flag,numChkbx){for(var i=0;i<numChkbx;i++){$("#chkbx"+i).attr("checked",flag);}return false;};
               }else{
                    injectFunction("selectAllChkbx(flag,numChkbx){for(var i=0;i<numChkbx;i++){document.getElementById('chkbx'+i).checked = flag;}return false;}");
               }
          }
/*======================================*\
l*        APPLICATIONS PAGE                                    |
\*======================================*/
          else if(pagetype == "student_app_summary")
          {
               /*======================================*\
               l*        INITIAL CONTENT CHANGES                          |
               \*======================================*/
               var tables = applyTableSorting("table table table.PSLEVEL1GRID" , pagetype);
               tables.find("div.PSHYPERLINKDISABLED:contains('Edit Application')").html("Cannot Edit Application");
               tables.eq(0).find("td:contains('Ranking Completed')").html("Ranked or Offer").parent().attr("title","This means that the company you had an interview with has either ranked or offered you a job.");

               //Append a button to give the user options not to crawl
               var allowSearchID = true;
               SCRIPTSURL
               $("form table table").eq(0).parent().prepend("<div style='margin: 10px 0px;font-size:12px;'><span style='font-size: 13px; font-weight: bold;'>Grabbing Job IDs</span><button onclick='return false;' class='PSPUSHBUTTON' id='appIDGrabber' style='margin: 0pt 10px; width: 130px;'>Continue Grabbing</button><img src='"+SCRIPTSURL+"/images/loading_small.gif' id='appIDGrabberLoading' style='display: none; height: 15px;'><br/><br/>This allows the script to find urls for job descriptions below and store them in your browser so that when you access the job descriptions again, they will load quickly in a new tab.<br/>The first time you click a job description, it may be slow but after you have accessed it once, it will load quicker the next time.</div>");
               $("#appIDGrabber").click(function(){   
                    //Invert the boolean to toggle
                    setAllowIDGrabbing(!allowSearchID);
               });
               
               //Set a timer to start to crawl all the jobs for IDs
               function startDelayGrabbing(){
                    setTimeout(function(){                                        
                         autoSeekJobID();
                    }, autoSeekingDelay);
               }
               
               function setAllowIDGrabbing(state)
               {
                    allowSearchID = state;
                    if(allowSearchID){
                         $("#appIDGrabberLoading").css("display","inline");
                         $("#appIDGrabber").html("Stop Grabbing");
                         startDelayGrabbing();
                    }else{
                         $("#appIDGrabberLoading").css("display","none");
                         $("#appIDGrabber").html("Continue Grabbing");
                    }
               }
               setAllowIDGrabbing(true);

               /*======================================*\
               l*        JOB ID STORAGE SYSTEM                             |
               \*======================================*/
               //SemiGlobal Variables, holds the important values to push in storage
               var company = "";
               var autoSeekingDelay = 5000;
               var jobDescription = "";
               var clickedElement = {};
               var linkElements = [];
               var userWaitingTab = false;
               
               //Check to see if we can use storage
               if(localStorage == null) {
                    alert("Sorry, storage (html5) not supported by the browser, please use a new version of the browser.");
                    return;
               }
               
               //Object that manages the storage of keys and jobs ids
               var appJobIdStorage = {
               //Variables
                    idKeys              : [],                                                  //holds the arrays of all the stuff
                    KEYNAME_APP   : "KEYBASE_NAME_APPLICATION",           //constant that holds the name of the key to access all the job keys
               //Inits the storage by getting all the id's
                    init:            function(){       try{
                         var keys = [];             
                         if( (keys = this.readID(this.KEYNAME_APP) ) !== false)
                         {    //Read the key if it exists
                              this.idKeys = keys.split(" ");
                         }    
                    }catch(e){alert("Init:\n"+e)}  },
               //Returns if the key exists
                    IDExists:      function(key){    
                         return this.readID(key) != false;
                    },
               //Sets the Job ID in storage, returns true if it works and false if it failed
                    addID:         function(key, value){    try{
                         //If it doesnt exist, put it into the array as well right our new list of keys
                         if( !this.IDExists(key) ){
                              this.idKeys.push(key);             
                              //alert("Adding "+key);
                              this.updateKeys();
                         }
                         //Try to store the item
                         try{
                              localStorage.setItem(key, value);
                         }catch(e){
                              alert("Failed to write to storage:\n"+e); return false;
                         }
                         return true;
                    }catch(e){alert("add:\n"+e)}       },
                    
               //Read an ID or return false if not found
                    readID:         function(key){          try{
                         var value = localStorage.getItem(key);
                         return value != null && value != "" ? value : false;
                    }catch(e){alert("read:\n"+e)}         },
               //Removes a value, returns the value if it worked, if not then it returns false
                    removeID:     function(key){       try{
                         var value;
                         if(value = this.readID(key))
                         {
                              localStorage.removeItem(key);
                              return value;
                         }
                         return false;
                    }catch(e){alert("remove:\n"+e)}     },
               //Push keys and updates the database
                    updateKeys:      function(){
                         try{      //Try to update our list of keys
                              localStorage.setItem(this.KEYNAME_APP, this.idKeys.join(" ") );          //Put a string of name delimited by a space
                         }catch(e){
                              alert("Failed to write to storage:\n"+e);  return false;
                         }
                    }
               };
               appJobIdStorage.init();
               
               //Once a user clicks a job without an ID, this runs the hyperlink in the iframe
               function lookupJobID(evt, obj)
               {
                    //Removing seeking functionality if someone has clicked
                    if(obj == null){
                         userWaitingTab = true;
                    }
                    
                    //Write these into the variables of the parent scope
                    clickedElement = obj ? obj : $(this);
                    company = clickedElement.attr("company");
                    jobDescription = clickedElement.text().trim().replace(/\xA0/g, " ");
                    
                    var _company      = encodeURIComponent(company);
                    var _description   = encodeURIComponent(jobDescription);
                    
                    //Set the source for the iframe
                    $("#hiddenIframe").attr("src",
                         "https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&Page=UW_CO_STU_JOBDTLS&UW_CO_JOB_TITLE="+_description+"&UW_CO_PARENT_NAME="+_company
                    );
               }
               
               //Auto seeks searches for the jobIDs without making a new tab 
               function autoSeekJobID()
               {    
                    if(allowSearchID === true && userWaitingTab === false && linkElements.length > 0)
                    {
                         //Seach the last ones first so there would be less loops
                         lookupJobID(null, linkElements[linkElements.length-1]);                         
                    }
               }
               //Create a temporary Array to hold all our keys
               var keyIndex = [];
               for(var i=0; i<appJobIdStorage.idKeys.length; i++)
               {
                    var item = appJobIdStorage.idKeys[i];
                    var keyCompanyName =  item.substring(0, item.lastIndexOf("|")).replace(/_/g, " ");
                    var keyDescription      =  item.substr(item.lastIndexOf("|")+1).replace(/_/g, " ");
                    var keyValue             = appJobIdStorage.readID(item);
                    //If value is false, that means it does not exist in the storage
                    if(keyValue === false){alert("Something broke"); return;}
                    
                    //KeyIndex[company][0-3]: 0 - description, 1 - id number, 2 - item or the original string, 3 - was it ever used
                    keyIndex[item] = new Array(keyDescription, keyValue, false);
               }
               
               //Add company for google search
               $("body > form > table td.tablepanel table.PSLEVEL1GRID tr:last-child td tr").each(function(rowNum){
                    //Do something on each row
                    var row = $(this).children();
                    if(row[0].nodeName.toUpperCase() != "TH")   
                    {
                         var companyName = row.eq(2).text().trim().replace(/\xA0/g, " ");           //Break the nbps; back to a space
                         var linkCol1Obj = row.eq(1).find("a");
                                               
                         var itemName = companyName.replace(/\s/g,"_") +"|"+ linkCol1Obj.text().trim().replace(/\xA0|\s/g, "_");
                         
                         if(  keyIndex[itemName] != null                                                                  //Do we have this job id in storage
                        // && linkCol1Obj.text().trim().replace(/\xA0|\s/g, "_") == keyIndex[companyName][0]       //Are the job descriptions the same?
                         //If the above conditions are true, then we have the link to this object
                         ){
                              linkCol1Obj.addClass("idExists").css("color", "red").attr("href","https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&UW_CO_JOB_ID="+keyIndex[itemName][1]).attr("target","_blank");
                              keyIndex[itemName][2] = true;        //mark down that we have used this
                         }
                         //Give the links an eventlistener to find the links
                         else
                         {
                              linkCol1Obj.attr("href","javascript:void").attr("company", companyName).bind("click", lookupJobID);
                              linkElements.push(linkCol1Obj);
                         }
                         
                         //Add the Google Search for company names
                         row.eq(2).wrapInner("<a class='googleSearch' title='Google Search that Company!!!' target='_blank' href='http://www.google.ca/#hl=en&q="+companyName.replace(/\s/g,"+")+"'/>");  
                         
                    }
               });
               
               //Now we can remove the ids that are not being used
               var newArr = [];
               for(var itemName in keyIndex)
               {
                    //check to see if this company was ever used
                    if(keyIndex[itemName][2])  {    
                         newArr.push(itemName);
                    }else{
                    //This company was never used, lets remove it
                         appJobIdStorage.removeID(itemName);
                    }
               }
               appJobIdStorage.idKeys = newArr;
               appJobIdStorage.updateKeys();
               
               //We are done with this array, we can remove it
               keyIndex = null;
               
               //Make an invisible iframe to handle links
               $("body").append('<iframe width="100%" height="35%" src="" id="hiddenIframe" name="hiddenIframe" style="display: none;position:fixed;bottom:0px;"></iframe>');     
               
               //Runs when the application form loads, this is where we can manipulate the id          
               $("#hiddenIframe").load(function(){try{
                    var jobID = getCookieValue("APP_LAST_ID");
                    
                    //If there is a location in the iframe and if the jobid is value
                    if( $(this).attr("src") != "" && jobID != -1)
                    {
                         //We are not seeking, this came from someone clicking a job
                         if(userWaitingTab === true){    
                         //Open new tab with the jobID
                              window.open("https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&UW_CO_JOB_ID=" + jobID);
                              userWaitingTab = false;
                              startDelayGrabbing();
                              //Remove popup
                              hideLoadingPopup();
                         }
                         else{
                         //This is auto seeking, we can call the function to seek another one
                              autoSeekJobID();
                         }
                         
                         //Add the id:  name|description = value
                         appJobIdStorage.addID( company.replace(/\s/g, "_")+"|"+jobDescription.replace(/\s/g, "_") , jobID);
                         
                         //Find all the links that correspond to the company name, there should be max 2
                         var index = 0;
                         var changeCounters = 0;
                         while(linkElements[index] && changeCounters < 2)
                         {
                              var eachLink = linkElements[index];
                              if(eachLink.attr("company") == company && eachLink.text().trim().replace(/\xA0/g, " ") == jobDescription){
                                   eachLink.addClass("idExists").unbind().css("color", "red").attr("href","https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&UW_CO_JOB_ID="+jobID).attr("target","_blank");
                                   linkElements.splice(index, 1);
                                   changeCounters++;
                              }
                              else{
                                   index++;
                              }
                         }
                         
                         //Give that link we clicked the new link
                         writeCookie("APP_LAST_ID", "-1");            //we have read the id, we dont need it anymore
                    }
                    
                    }catch(e){alert(e)}
               });
          }
/*======================================*\
l*        Interview Page                                           |
\*======================================*/
          else if(pagetype == "student_interviews")
          {  
               //Add an extra column for google calendars
               tableBody = $("table table table.PSLEVEL1GRID:eq(0) tr");
               if(tableBody.length > 2)      //Must have something in the table
               {
                    tableBody.each(function(rowNum){                                                
                         var row = $(this).children();                         
                         if(rowNum == 0)   //Header
                         {
                              //Adds a changes row
                              row.eq(12).after("<th class='PSLEVEL1GRIDCOLUMNHDR' align='left' scope='col'>Google Calendar</th>");
                         }
                         else      //Pull information and make the Google Calendars button
                         {    
                              //Change the hyperlink for the job descriptions
                              row.eq(3).find("a").attr("href","https://jobmine.ccol.uwaterloo.ca/servlets/iclientservlet/SS/?Menu=UW_CO_STUDENTS&Component=UW_CO_JOBDTLS&UW_CO_JOB_ID="+row.eq(1).html().trim()).attr("target","_blank");
                         
                              //Parse the date
                              var date = row.eq(4).html().trim().split(" ");
                              var day = date[0];
                              var month = parseMonth(date[1]);
                              var year = date[2];
                              
                              //Parse the time
                              var time = row.eq(7).html().trim().split(" ");
                              var dateStr;
                              if(time != "")
                              {          
                              //How long is the interview
                                   var length = parseInt(row.eq(8).html().trim());        
                              //Find start time
                                   var sMin = time[0].split(":")[1];                                 
                                   var sHour = time[0].split(":")[0];
                                   sHour = parseInt(sHour[0] == "0" ? sHour.substring(1) : sHour);      //remove leading zeros                                   
                                   sHour +=  parseInt(new Date().getTimezoneOffset()/60 + (time[1] == "pm" && sHour != "12" ? 12 : 0));
                              //Find the ending time                                   
                                   var eMin = parseInt(sMin) + length;
                                   var eHour = sHour;
                                   if(eMin >= 60)           //Overflow in time
                                   {
                                        eMin = ((eMin-60)+"").length < 2 ?  "0"+(eMin-60) : eMin-60;
                                        eHour += 1;
                                   }   
                                   //Write the time string to be parsed by Google Calendar
                                   dateStr = year + month + day + "T" + sHour + sMin + "00Z/" + year + month + day + "T" + eHour + eMin + "00Z";
                              }
                              
                              //Other pieces of info
                              var location = row.eq(9).html().replace(/&nbsp;/g," ").trim(); location = location != "" ? "Tatham Centre: Room "+location : "Offsite Location (check description)";
                              var company = row.eq(2).html().trim();
                              var type = row.eq(5).html().trim();
                              var instructions = row.eq(10).html().replace(/&nbsp;/g," ").trim(); instructions = instructions != "" ? "\nExtra Information:\n"+instructions : "";
                              var interviewer = row.eq(11).html().trim();
                              var jobTitle = row.eq(3).find("a").html().trim();
                              
                              //Write the details
                              var details = (type + " interview with " + company + " (" + interviewer + ")\nTitle: "+ jobTitle + "\n"+instructions).replace(/ /g,"%20").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C").replace(/,/g,"%2C");
                              
                              //Check to see all fields are valid before we add the calendar, else leave it blank
                              if(month && time != "" && type && jobTitle){
                                   row.eq(12).after('<td title="Click to add to Google Calendar!" class="PSLEVEL1GRIDODDROW" align="left"><a href="http://www.google.com/calendar/event?action=TEMPLATE&text=Coop Interview with '+company+'&dates='+dateStr+'&details='+details+'&location='+location+'&trp=false&sprop=&sprop=name:" target="_blank"><img src="http://www.google.com/calendar/images/ext/gc_button6.gif" border=0></a></td>');
                              }else{
                                   row.eq(12).after('<td class="PSLEVEL1GRIDODDROW" align="left">&nbsp;</td>');
                              }
                         }         
                    });
               }
               var tables = applyTableSorting("table table table.PSLEVEL1GRID" , pagetype);
          }
          else
/*======================================*\
l*        OTHER PAGES                                             |
\*======================================*/
          {
               var tables = applyTableSorting("table table table.PSLEVEL1GRID" , pagetype);
          }
/*======================================*\
l*        HINT SYSTEM                                             |
\*======================================*/
          //Constants 
          var hintArray = new Array();
          hintArray["com"] = new Array();
          hintArray["apps"] = new Array();
          hintArray["short"] = new Array();
          hintArray["search"] = new Array();
         
          //Common hints for all pages
          hintArray["com"].push({page: "com",percentage: 0.4,obj:$("#settings_nav")[0], text : "Check out the settings tab to customize your experience. You can remove the timer and/or set the default page Jobmine Plus loads."});
          hintArray["com"].push({page: "com",percentage: 0.3,obj:tables.find("th.PSLEVEL1GRIDCOLUMNHDR.header")[2], text : "Click the header a column to sort jobs and other information."});
          hintArray["com"].push({page: "com",percentage: 0.4,obj:$("#about_nav")[0], text : "Send me an email if you have any questions, concerns or wanted features."});
          
          //Applications hints
          hintArray["apps"].push({page: "apps",percentage: 0.4,obj:tables.find("a.googleSearch")[0], text : "You can now select the company name and Jobmine Plus will Google search it for you in a new tab."});
          
          //Shortlist hints
          hintArray["short"].push({page: "short",percentage: 0.5,obj:tables.find("input.editChkbx")[0], text : "You can delete multiple short list jobs with checkboxes. It also supports shift-click functionality."});
          
          //Job Search hints
          hintArray["search"].push({page: "search",percentage: 0.4,obj:tables.find("a.mapsSearch")[0], text : "You can now select the location and Jobmine Plus will Google Maps it for you."});
          hintArray["search"].push({page: "search",percentage: 0.3,obj:tables.find("th.PSLEVEL1GRIDCOLUMNHDR:contains('Hiring Chances*')")[0], text : "This is hiring changes. Note: you need to be skilled to get the job, I am not responsible for incorrect statistics."});
          
          function saveTooltip()
          {               
              var cookieQuery = $("#enableTooltip")[0].checked ? 1 : 0;  
               if(cookieQuery != 0)               //is tooltips enabled?           
               {
                    var searchTable = $("#settings_tooltip table");
                    for(var page in hintArray)
                    {
                         if(page != "enable")
                         {
                              cookieQuery += "|"+page +"=";
                              for(var i=0;i<hintArray[page].length;i++){cookieQuery += (searchTable.find("input[num='"+i+"'][page='"+page+"']")[0].checked ? 1 : 0) + ",";}
                              cookieQuery = cookieQuery.slice(0, -1);        //removes last comma                    
                         }
                    }
               }
               writeCookie("TOOLTIP", cookieQuery);         //alert(cookieQuery);
          }
                  
          //Closes and fades out the hint box
          $("#hintmsg a").bind("click",function(){
               $(this).unbind("click");
               $(window).unbind("resize");
               $(this.parentNode).fadeOut(500);
               
               if($("#preventShowingChkbx").attr("checked"))
               {              
                    var index = 0;
                    var query = getCookieValue("TOOLTIP").split("|");
                    var page = $("#preventShowingChkbx").attr("page");
                    while(query[index].indexOf(page+"=") == -1 && index++ < query.length);
                    var selectedValues = query.splice(index,1).toString().split("=")[1].split(",");
                    index = $("#preventShowingChkbx").attr("num");
                    if(index > selectedValues.length)       //if the jobmine plus has a new hint that is not in cookies
                    {
                         var diff = index-selectedValues.length;
                         var count = hintArray[page].length - selectedValues.length;
                         for(var i=0; i<count;i++){
                              if(i == diff){selectedValues.push(0);}       //when they are the same           
                              else{selectedValues.push(1);}
                         }
                    }
                    else                                              //if the hint is in the cookies
                    {
                         selectedValues.splice(index, 1, 0);          //we go to the index in the array and replace it with 0 (which is false)
                    }
                    query.push(page+"="+selectedValues.join(","));
                    writeCookie("TOOLTIP", query.join("|"));
             }
          });
          
          var tempPageHint;
          
          //Map the hints
          switch(pagetype)
          {
               case "student_app_summary":
                    tempPageHint = hintArray["apps"];
                    break;
               case "job_short_list":
                    tempPageHint = hintArray["short"];
                    break;
               case "job_search_component":
                    tempPageHint = hintArray["search"];
                    break;
               default:
                    tempPageHint = new Array();
                    break;
          }
          
          function positionHint(objPoint)
          {
               var orientation = null;
               
               //Dimensions of Orientations, HARDCODED
               var VERTICALHINT = new Array(218, 157);
               var HORIZONTALHINT    = new Array(235, 138);
               var marginPercentage = 0.2;
               var offsets = $(objPoint).offset();
               var objLeft = parseInt(offsets.left);
               var objTop = parseInt(offsets.top);
             
               //Find the best orientation for the hint box
               if(objTop < $("body").height()/2)
               {
                    if((objLeft+VERTICALHINT[0]/2)*parseInt(1+marginPercentage) > window.innerWidth){orientation = "right";}
                    else if(objLeft-VERTICALHINT[0]/2 < window.innerWidth*marginPercentage){orientation = "left";}
                    else{orientation = "up";}
               }
               else
               {
                    if((objLeft+VERTICALHINT[0]/2)*parseInt(1+marginPercentage) > window.innerWidth){orientation = "right";}
                    else if(objLeft-VERTICALHINT[0]/2 < window.innerWidth*marginPercentage){orientation = "left";}
                    else{orientation = "down";}
               }
               //Position the hint box
               switch(orientation)   
               {
                    case "up":     
                         objLeft += parseInt(-VERTICALHINT[0]/2+$(objPoint).outerWidth(true)/2);
                         objTop += parseInt($(objPoint).outerHeight(true));
                         break;
                    case "down":
                         objLeft += parseInt(-VERTICALHINT[0]/2+$(objPoint).outerWidth(true)/2);
                         objTop -= VERTICALHINT[1];
                         break;
                    case "left":
                         objLeft += $(objPoint).outerWidth(true);
                         objTop -= parseInt(HORIZONTALHINT[1]/2-$(objPoint).outerHeight(true)/2);
                         break;
                    case "right":
                         objLeft -= HORIZONTALHINT[0];
                         objTop -= parseInt(HORIZONTALHINT[1]/2-$(objPoint).outerHeight(true)/2);
                         break;
                    default:
                         return;
                         break;
               }
               $("#hintmsg")[0].className = orientation;
               $("#hintmsg").css("left",objLeft+"px").css("top",objTop+"px");
          }
          
          function randomizeHints(array)
          {
               //Load cookie
               var cookieVal = getCookieValue("TOOLTIP");
               if(cookieVal != 0)       //Do not show any hints 
               {
                    //Choose a random hint
                    var randomIndex = Math.floor(Math.random()*array.length+1)-1;
                    var hint = array[randomIndex];
                    var chosenIndex = Math.floor(Math.random()*101);
                    //See if we display it based on the percentage probability
                    var probability = hint.percentage*100;
                    
                    //See if user has disabled selected cookie
                    var index = 0;
                    if(cookieVal != -1 && cookieVal.indexOf("1|") == 0) //no cookie exists
                    {
                         var query = cookieVal.split("|");          
                         while(query[index].indexOf(hint.page+"=") == -1 && index++ < query.length);
                         var selectedValues = query.splice(index,1).toString().split("=")[1].split(",");
                         var number = hint.page != "com" ? randomIndex : randomIndex - tempPageHint.length;
                    }
                    else{
                         var selectedValues = new Array();
                         
                         //Build a default cookie
                         var cookieQuery = "1";
                         for(var page in hintArray)
                         {
                              if(page != "enable")
                              {
                                   cookieQuery += "|"+page +"=";
                                   for(var i=0;i<hintArray[page].length;i++){cookieQuery += "1,";}
                                   cookieQuery = cookieQuery.slice(0, -1);        //removes last comma                    
                              }
                         }
                         writeCookie("TOOLTIP", cookieQuery);         //alert(cookieQuery);
                    }
                    
                    //Show it
                    if(selectedValues[number] != 0 && chosenIndex <= probability && hint.obj)   //also check if user blocked this hint
                    {
                         positionHint(hint.obj);                    
                         $("#hintmsg #description").html(hint.text);
                         $("#preventShowingChkbx").attr("page",hint.page);
                         $("#preventShowingChkbx").attr("num", number);
                         $("#hintmsg").fadeIn(1200);
                         
                         //Window Resizing and reposition
                         $(window).bind("resize",function(){positionHint(hint.obj);});
                    }
               }
          }
          
          //Generate the Tooltip Settings page
          var tooltipGenerated = "<div style='margin-bottom:15px;'><input id='enableTooltip' class='tooltipChkbx' type='checkbox'/>Enable Tooltips</div><table cellpadding='0' cellspacing='0'>";
          var index=0;
          for(var page in hintArray)
          {
               var arr = hintArray[page];
               for(var i=0;i<arr.length;i++)
               {
                    tooltipGenerated += "<tr><td valign='top'><input id='toolChkbx"+(index++)+"' class='tooltipChkbx' page='"+page+"' num='"+i+"' type='checkbox'/></td><td class='details' valign='top'>"+arr[i].text+"<br/><br/></td></tr>";
               }
          }
          tooltipGenerated += "</table>";
          index = null;
/*======================================*\
l*        SETTINGS                                                  |
\*======================================*/        
          //Build the settings
          addSettingsItem("General",SETTINGS_GENERAL);
          addSettingsItem("Tooltip",tooltipGenerated);
          
          //Clicking the menu nav under settings
          $("#settingsNav a").click(function(){
               var name = $(this).html();
               $("#popupTitle").html(name+" Settings");
               for(var i=0;i<$("#settingsContent")[0].childNodes.length;i++){$("#settingsContent")[0].childNodes[i].style.display='none';}     
               $("#settings_"+name.toLowerCase()).css("display","block");
          });
          
          function saveGeneralSettings()
          {
               var autorefresh = $("#popupText").attr("value");
               if(autorefresh && autorefresh.search(/^[0-9]+(\.[0-9]+$)?/g) == -1){alert("Please make sure that the Auto Refresh Duration is a positive decimal or integer number (numbers and a period).");return;};
               var remove_load = $('#loadCheckbox').attr("checked");
               var remove_timer = $('#removeTimerChkbx').attr("checked");
               var hideupdates = $('#updateCheckbox').attr("checked");
               var default_page = $("#popupSelect").attr("value");
               //Write Cookies
               writeCookie('LOAD_SCREEN', remove_load ? 1 : 0);
               writeCookie('DISABLE_TIMER', remove_timer ? 1 : 0);
               writeCookie('HIDE_UPDATES', hideupdates ? 1 : 0);
               writeCookie('DEFAULT_PAGE', default_page);
               writeCookie('AUTO_REFRESH', autorefresh);
          }
          
          //Mainly only for settings
          $("#saveSettings").click(function(){
               saveGeneralSettings();
               saveTooltip();
               hidePopup();
               showLoadingPopup();
               window.location.href = window.location.href;
          });
          
          //Bind the change event listener to the checkbox
          $("#removeTimerChkbx").change(function(){toggleRemoveTimer(this);});
          $("#enableTooltip").change(function(){toggleEnableTooltip(this);});
          
          /*
           *   POPUP TOGGLES
           */
          //Toggle the tooltip enable
          function toggleEnableTooltip(obj){
               if(obj.checked){  $(obj.parentNode.nextSibling).removeClass("disabled").find("input").removeAttr("disabled").attr("checked","checked");}
               else{$(obj.parentNode.nextSibling).addClass("disabled").find("input").attr("disabled","disabled");}
          };
          
          //Shows the text description if checked
          function toggleRemoveTimer(obj){
               if(obj.checked){    $("#popupText").removeAttr("disabled").css("background-color","white").css("color","black").parent().prev().css("color","black").removeClass("disabled");}
               else{$("#popupText").attr("disabled","disabled").css("background-color","#EEE").css("color","#CCC").parent().prev().addClass('disabled').css("color","#CCC");}
          };
/*======================================*\
l*        POPUP SPECIFIC FUNCTIONS                         |
\*======================================*/          
          //Opening the popup
          $("#jobminepanel a.popupOpen").click(function(){
               showPanel($(this).html().trim(),$(this).attr("width"),$(this).attr("height"));
          });
          
          //Closing the popup
          $("#panelWrapper button.closePopup").click(function(){
               hidePopup();
          });
          
          //When the popup is shown, the panel is shown based off the name
          function showPanel(panelName, width, height)
          {
               if($("#"+panelName))
               {
                    for(var i=0;i<$("#panelWrapper")[0].childNodes.length;i++){$("#panelWrapper")[0].childNodes[i].style.display='none';}                      
                    $("#"+panelName).css("display","block");
                    $('#popupTitle').html(panelName);
                    $("#popupContainer").css("display","block");
                    $("body").css("overflow","hidden");
                    
                    //Resize
                    $("#popupContent").css("width",width+"px").css("height",height+"px").css("left",-width/2+"px").css("top",-height/2+"px");
                    
                    //Load preferences from cookies
                    if(panelName == "Settings")  
                    {    //Load all the general settings from cookies
                         $('#popupTitle').html("General Settings");
                         $("#popupSelect").attr("value",getCookieValue('DEFAULT_PAGE'));
                         $("#popupText").attr("value",(getCookieValue('AUTO_REFRESH') != -1 ? getCookieValue('AUTO_REFRESH') : 0));
                         $('#removeTimerChkbx').attr("checked",(getCookieValue('DISABLE_TIMER') == 1 ? true : false));  
                         $('#updateCheckbox').attr("checked",(getCookieValue('HIDE_UPDATES') == 1 ? true : false));  
                         $('#loadCheckbox').attr("checked",(getCookieValue('LOAD_SCREEN') == 1 ? true : false));  
                         
                         //Load all the tooltip settings from cookies
                         var cookieVal = getCookieValue("TOOLTIP");
                         var query = cookieVal == -1 ? new Array(0) : cookieVal.split("|");
                         if(query.shift() != 0)        //is tooltips enabled?
                         {
                              $("#enableTooltip").attr("checked","checked").parent().next().removeClass("disabled").find("input").removeAttr("disabled");
                              for(var page in hintArray)          //Each Page
                              {
                                   //Find the index we need and populate an array, if the hint has nothing in it, ignore it
                                   if(hintArray[page].length > 0)     
                                   {
                                        if(query.length > 0){         //Does the page in the cookie exist?
                                             var index = 0;
                                             while(query[index].indexOf(page+"=") == -1 && index++ < query.length);     //Find the right array inside query
                                             var savedValues = query.splice(index,1).toString().split("=")[1].split(",");
                                        } 
                                        else{savedValues = new Array();}
                                        for(var i=0;i<hintArray[page].length;i++){         //Each value of that page
                                             if(savedValues[i])       //is there any values in that page of the cookie?
                                                  {$("#settings_tooltip table input[num='"+i+"'][page='"+page+"']")[0].checked = savedValues[i] != 0;}
                                             else
                                                  {$("#settings_tooltip table input[num='"+i+"'][page='"+page+"']")[0].checked = true;}
                                        }
                                   }
                              }
                         }
                         else
                         {
                              $("#enableTooltip").removeAttr("checked");
                              toggleEnableTooltip(document.getElementById("enableTooltip"));
                         }
                         
                         //Set Toggles
                         toggleRemoveTimer(document.getElementById("removeTimerChkbx"));
                         
                         for(var i=0;i<$("#settingsContent")[0].childNodes.length;i++){$("#settingsContent")[0].childNodes[i].style.display='none';}     
                         $("#settingsContent")[0].firstChild.style.display = "block";
                    }
               }
          }
          
          function hidePopup(){$("#popupContainer").css("display","none");$("body").css("overflow","auto");$("#panelWrapper").children().each(function(){$(this).css("display","none");});};
          
          //When to run the white overlay
          if(getCookieValue('LOAD_SCREEN') != 1)
          {
               $("a").click(function(){
                    if($(this).attr("target")!= "_blank" && $(this).attr("target") != "new" && $(this).attr("popup")!= "false" && $(this).parent().html().indexOf('onclick="return ') == -1  && $(this).attr('href').indexOf('mailto') == -1){
                         showLoadingPopup();
                    }
               });

               $("input").click(function(){
                    if($(this).attr("type") == "button"){
                         showLoadingPopup();
                    }
               });
          }
          
          //For decimals and numbers
          injectFunction("decimalOnly(evt){var charCode = (evt.which) ? evt.which : event.keyCode;if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46){return false;}else{return true;}}");
          
/*======================================*\
l*        REMOVING THE TIMER                                  |
\*======================================*/       
          if(getCookieValue('DISABLE_TIMER') == 1){    
               if(ISFIREFOX){
                    unsafeWindow.setupTimeout = function(){return false;};
                    unsafeWindow.displayTimeoutMsg = function(){return false;};
                    unsafeWindow.displayTimeoutWarningMsg = function(){return false;};
               }else{
                    injectFunction('displayTimeoutMsg(){return false;}');
                    injectFunction('displayTimeoutWarningMsg(){return false;}');
                    runJS("clearInterval(timeoutID)");
                    runJS("clearInterval(timeoutWarningID)");
               }
               if(getCookieValue('AUTO_REFRESH') <= 0  || getCookieValue('AUTO_REFRESH') > 19){
               //2nd setTimeout Fixes Chrome refresh after add shortlist from search
                    setTimeout(function(){
                         setTimeout(function(){
                         window.location = window.location;
                         }, 19 * 1000 * 60);
                    },1);
               }else{
                    document.addEventListener('click',resetGlobalTimer,true);
                    resetGlobalTimer();
               }
          }
/*======================================*\
l*        CSS READY LOAD                                        |
\*======================================*/  
          cssReady(function(){
               try{
               
               randomizeHints(tempPageHint.concat(hintArray["com"]));
               
               //If we are at jobs, we can run the visited highlighting and sorting
               if(pagetype == "job_search_component"){ setReadyVisited(); }
               
               
               }catch(e){alert(e)}
          },200);
/*======================================*\
l*        HIGHLIGHTING                                            |
\*======================================*/         
          // Set syntax highlighting colours for various statuses
          var VERYGOOD   = "#9f9";
          var GOOD          = "#61efef";
          var MEDIOCRE    = "#faf39a";
          var BAD             = "#fdaaaa";
          var WORST        = "#b5bbc1";
          
          if(tables)
          {
               switch(pagetype)
               {
                    case "student_app_summary":
                         tables.find("tr").find("td:first, th:first").remove();
                         tables.find("tr:contains('Ranking')").find("td").css("background-color",MEDIOCRE);
                         tables.find("tr:contains('Ranking Complete')").find("td").css("background-color",BAD);
                         tables.find("tr:contains('Ranked or Offer')").find("td").css("background-color",GOOD);
                         tables.find("tr:contains('Selected')").find("td").css("background-color",VERYGOOD);	
                         tables.find("tr:contains('Alternate')").find("td").css("background-color",MEDIOCRE);
                         tables.find("tr:contains('Scheduled')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Employed')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Not Selected')").find("td").css("background-color",WORST);
                         tables.find("tr:contains('Filled')").find("td").css("background-color",BAD);
                         tables.find("tr:contains('Not Ranked')").find("td").css("background-color",WORST);
                         tables.find("tr:contains('Applied')").find("td").css("background-color",'');
                         tables.find("tr:contains('Approved')").find("td").css("background-color",BAD);
                         tables.find("tr:contains('Cancelled')").find("td").css("background-color",BAD);
                         break;
                    case "student_sel.interview_schedule":
                         tables.find("tr:contains('Break')").find("td").css("background-color",MEDIOCRE);
                         break;
                    case "job_short_list":
                         tables.find("tr:contains('Already Applied')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Not Posted')").find("td").css("background-color",BAD);
                         tables.find("tr:contains('Not Authorized to Apply')").find("td").css("background-color",WORST);
                         break;
                    case "student_interviews":
                         tables.find("tr:contains('Ranking')").find("td").css("background-color",MEDIOCRE);
                         tables.find("tr:contains('Scheduled')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Screened')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Selected')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Filled')").find("td").css("background-color",WORST);
                         tables.find("tr:contains('Unfilled')").find("td").css("background-color",WORST);
                         break;
                    case "student_ranking_open":
                         tables.find("tr:contains('Offer')").find("td").css("background-color",VERYGOOD);
                         tables.find("tr:contains('Ranked')").find("td").css("background-color",GOOD);
                         tables.find("tr:contains('Not Ranked')").find("td").css("background-color",WORST);
                         break;
                    case 'job_search_component':
                         tables.find("tr:contains('On Short List')").find("td").css("background-color",WORST);
                         tables.find("tr:contains('Not Able to Shortlist')").find("td").css("background-color",WORST);
                         tables.find("tr:contains('Already Applied')").find("td").css("background-color",WORST);
                         break;
               }
          }
     } 
}