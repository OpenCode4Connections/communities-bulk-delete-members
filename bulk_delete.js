var features = {
    COMMUNITIES_MEMBERS_BULK_DELETE_BUTTON          : true
};

var config = {
    default_language    : 'en_US',
    supported_languages : ['en_US', 'fr_FR', 'de'],
    current_language    : '',
    plugins             : {WIKIS_SIDEBAR_LINKS_ENABLE_SCROLLBAR : { WIKIS_SIDEBAR_LINKS_NAV_HEIGHT : '100px'}},
    is_cloud            : (typeof gllConnectionsData == "object" || typeof icUser == "object"),
    homepage_url        : "/homepage"
};

var strings = {
    'en_US' : {ERASE : 'Erase', DELETE : 'Delete', CANCEL : 'Cancel',DOWNLOAD_CSV : "Download CSV", ADD_TO_FAVOURITES : 'Add to Favourites', FAVOURITED : 'A Favourite Community', BULK_DELETE_MEMBERS : 'Bulk delete members', NO_MEMBERS_SELECTED : 'You have not selected any members to be deleted', CONFIRM_MEMBER_DELETE_1 : 'Are you sure you want to delete', CONFIRM_MEMBER_DELETE_2_1 : ' member', CONFIRM_MEMBER_DELETE_2_2 : ' members',CONFIRM_MEMBER_DELETE_3 : '? There is no way to undo this action.', SELECT_ALL : 'Select all', FAVOURITE_COMMUNITIES : 'Favourite Communities', MY_FAVOURITE_COMMUNITIES : 'My favourite Communities', NO_COMMUNITIES_ADDED : 'You have not added any communities to your favourites.', NUMBER_OF_PEOPLE_TO_BE_DELETED : 'Number of people to be deleted:'},
    'fr_FR' : {ERASE : 'Effacer', DELETE : 'Supprimer',CANCEL : 'Annuler', DOWNLOAD_CSV : "Télécharger le CSV", ADD_TO_FAVOURITES : 'Ajouter à mes favoris', FAVOURITED : 'Une communauté préférée', BULK_DELETE_MEMBERS : 'Masse supression des membres', NO_MEMBERS_SELECTED : 'Vous n\'avez pas selectionné de membre à supprimer', CONFIRM_MEMBER_DELETE_1 : 'Êtes-vous sûr de vouloir supprimer', CONFIRM_MEMBER_DELETE_2_1 : ' membre', CONFIRM_MEMBER_DELETE_2_2 : ' membres', CONFIRM_MEMBER_DELETE_3 : '? Il n\'est pas possible d\'annuler cette action.', SELECT_ALL : 'Tout sélectionner', FAVOURITE_COMMUNITIES : 'Communautés Favorites', MY_FAVOURITE_COMMUNITIES : 'Mes communautés préférées',NO_COMMUNITIES_ADDED : 'Vous n\'avez pas de communautés favorites', NUMBER_OF_PEOPLE_TO_BE_DELETED : 'Le nombre de personnes à supprimer'},
    'de' : {ADD_TO_FAVOURITES : 'Zu Favoriten hinzufügen'}
};

function set_language()
{
    var user_lang = atob(dojo.cookie('user_lang').substring(0,dojo.cookie('user_lang').indexOf('=')));

    if(config.supported_languages.indexOf(user_lang) > -1)
    {
        config.current_language = user_lang;
    }
    else
    {
        config.current_language = config.default_language;
    }
}
function get_translation(placeholder)
{
    return strings[config.current_language][placeholder];
}

/*** RUN ***/

set_language();

if(features.COMMUNITIES_MEMBERS_BULK_DELETE_BUTTON)
{
    document.addEventListener('DOMContentLoaded',function()
    {
        if(window.location.hash.startsWith('#fullpageWidgetId=Members') || window.location.pathname.startsWith('/communities/service/'))
        {
            var members = {};
            var deletion_list = [];

            function display_mass_delete_button()
            {
                var timer = setInterval(function()
                {
                    if(document.querySelectorAll('#memberAddButton span').length !== 0)
                    {
                        var xhttp = new XMLHttpRequest();

                        xhttp.onreadystatechange = function()
                        {
                            if(this.readyState == 4 && this.status == 200)
                            {
                                if(this.responseText.indexOf(gllConnectionsData.userId) > -1)
                                {
                                    //document.getElementById('memberAddButton').innerHTML+='<span class="lotusBtn lotusBtnAction lotusLeft commFocusMT"><a role="button" titlekey="bulk_delete_members" onclick="render_dialog_box();" href="javascript:void(0);"></a></span>';
                                    var bulk_delete_button_wrapper = document.createElement('SPAN');
                                    bulk_delete_button_wrapper.className = "lotusBtn lotusBtnAction lotusLeft commFocusMT";
                                    var bulk_delete_button = document.createElement("A");
                                    bulk_delete_button.setAttribute('role','button');
                                    bulk_delete_button.setAttribute('titlekey','bulk_delete_members');
                                    bulk_delete_button.setAttribute('href','javascript:void(0);');
                                    bulk_delete_button.appendChild(document.createTextNode(get_translation('BULK_DELETE_MEMBERS')));
                                    bulk_delete_button.addEventListener('click',render_dialog_box,false);
                                    bulk_delete_button_wrapper.appendChild(bulk_delete_button);
                                    document.getElementById('memberAddButton').appendChild(bulk_delete_button_wrapper);
                                    add_listeners();
                                }
                            }
                        };

                        xhttp.open("GET", '/communities/service/atom/forms/community/members?lite=true&communityUuid='+resourceId+'&sortBy=created&desc=true&role=owner&ps=100', true);
                        xhttp.send();

                        clearInterval(timer);
                    }
                }, 600);
            }

            function render_dialog_box()
            {
                deletion_list = [];
                var wrapper = document.createElement('div');
                wrapper.setAttribute('id','delete_community_members_wrapper');
                wrapper.innerHTML = '<style type="text/css">#modal_community_members > div{height:50px;border-bottom:1px solid #000000;}#modal_community_members > div.disabled{background-color: rgba(0,0,0,0.3);}#modal_community_members div.user_photo{width:50px;height:50px;float:left;margin-left:15px;}#modal_community_members div.user_photo img{margin-top:2px;border-radius:15px;height:45px;width:45px;}#modal_community_members div.user_name{height:50px;float:left;margin-left:15px;}#modal_community_members div.user_name span{display:block;font-weight:bold;}#modal_community_members div.confirm{float:right;margin-top:12px;}#delete_community_members_modal .delete_button:hover{text-decoration:none !important;border-color:#bf0101 !important;color:#bf0101 !important;}#delete_community_members_modal .cancel_button:hover{text-decoration:none !important;border-color:#1D3458 !important;color:#1D3458 !important;}</style><div style="position:fixed;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,0.7);z-index:1500;"></div><div id="delete_community_members_modal" style="position:fixed;width:450px;height:500px;z-index:999999;top:50%;left:50%;margin:-250px 0 0 -225px;background:white;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"><div style="width: 100%;height: 45px;background-color: #325c80;color: #FFFFFF;text-align: center;line-height: 45px;font-size: 22px;border-bottom: 1px solid #264661;">'+get_translation('BULK_DELETE_MEMBERS')+'</div><div style="height: 30px;border-bottom: 1px solid #000000;line-height: 30px;"><span style="color:#000;margin-left:15px;float:left;"><input type="checkbox" name="select_all" id="community_bulk_delete_select_all" style="margin-bottom:7px;"><label style="color:#000 !important;font-size:14px;">'+get_translation('SELECT_ALL')+'</label></span><span style="float:right;margin-right:15px;font-size:14px;color:#000 !important;">'+get_translation('NUMBER_OF_PEOPLE_TO_BE_DELETED')+' <b id="number_of_people_deletion_list">0</b></span></div><div style="width:100%;height: 370px;border-bottom: 1px solid #000000;overflow-y: scroll;" id="modal_community_members"></div><div><a href="javascript:void(0);" style="display: inline-block;padding: 8px 17px;margin: 5px;border: 2px solid #ff0000;color: #ff0000 !important;" id="modal_delete_button" class="delete_button">'+get_translation('DELETE')+'</a><a style="display: inline-block;padding: 8px 17px;margin: 5px;border: 2px solid #325c80;color:#325c80 !important;" class="cancel_button" id="modal_cancel_button" href="javascript:void(0);">'+get_translation('CANCEL')+'</a></div></div>';
                document.getElementsByTagName('body')[0].appendChild(wrapper);

                document.getElementById('community_bulk_delete_select_all').addEventListener('click',toggle_all,false);
                document.getElementById('modal_delete_button').addEventListener('click',confirm_bulk_member_delete,false);
                document.getElementById('modal_cancel_button').addEventListener('click',cancel_community_modal,false);

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function()
                {
                    if(this.readyState == 4 && this.status == 200)
                    {
                        render_community_members(this.responseText);
                    }
                };
                xhttp.open("GET", '/communities/service/atom/forms/community/members?lite=true&communityUuid='+resourceId+'&sortBy=created&desc=true&ps=10000&format=full', true);
                xhttp.send();

            }

            function render_community_members(response)
            {
                var members_regex = /<entry>(.*?)<\/entry>/ig;
                var member_name = /<name>(.*?)<\/name>/i;
                var member_id_regex = /<snx:userid xmlns:snx="http:\/\/www\.ibm\.com\/xmlns\/prod\/sn">(.*?)<\/snx:userid>/m;
                var member_email_regex = /<email>(.*?)<\/email>/i;
                var modal_html = '';
                var current_user = gllConnectionsData.userId;

                var members_list = response.match(members_regex);

                for(var i = 0; i < members_list.length; i++)
                {
                    var match = members_list[i];
                    var user_name 		= member_name.exec(match);
                    var user_id 		= member_id_regex.exec(match);
                    var user_email 		= member_email_regex.exec(match);
                    var email 			= (user_email != null) ? user_email[1] : '';
                    members[user_id[1]] = {"user_id" : user_id[1], "user_email" : email, "user_name" : user_name[1]};
                    var disabled        = current_user == user_id[1] ? 'disabled' : '';
                    modal_html+='<div class="'+disabled+'"><div class="user_photo"><img src="/contacts/profiles/photoById/'+user_id[1]+'"/></div><div class="user_name"><span>'+user_name[1]+'</span><span>'+email+'</span></div><div class="confirm"><input type="checkbox" '+disabled+' data-user_id="'+user_id[1]+'"/></div></div>';
                }

                document.getElementById('modal_community_members').innerHTML = modal_html;

                var checkboxes = document.querySelectorAll('#modal_community_members > div input[type="checkbox"]');

                for(i = 0; i < checkboxes.length; i++)
                {
                    checkboxes[i].addEventListener('click',toggle_delete,false);
                }
            }

            function toggle_delete()
            {
                user_id = this.getAttribute('data-user_id');
                deletion_list.indexOf(user_id) > -1 ? deletion_list.splice(deletion_list.indexOf(user_id),1) : deletion_list.push(user_id);
                update_delete_count();
            }

            function update_delete_count()
            {
                document.getElementById('number_of_people_deletion_list').innerText = deletion_list.length;
            }

            function toggle_all()
            {
                deletion_list 	= [];
                var checkboxes 	= document.getElementById('modal_community_members').querySelectorAll('input[type="checkbox"]:not([disabled])');

                if(this.checked)
                {
                    for(var j = 0; j < checkboxes.length; j++)
                    {
                        deletion_list.push(checkboxes[j].getAttribute('data-user_id'));
                        checkboxes[j].checked = this.checked;
                    }
                }
                else
                {
                    for(var j = 0; j < checkboxes.length; j++)
                    {
                        checkboxes[j].checked = this.checked;
                    }
                }

                update_delete_count();
            }

            function cancel_community_modal()
            {
                document.getElementById("delete_community_members_wrapper").outerHTML = "";
            }

            function confirm_bulk_member_delete()
            {
                if(deletion_list.length == 0)
                {
                    alert(get_translation('NO_MEMBERS_SELECTED'));
                }
                else
                {
                    var r = confirm(get_translation('CONFIRM_MEMBER_DELETE_1')+" "+deletion_list.length+(deletion_list.length == 1 ? get_translation('CONFIRM_MEMBER_DELETE_2_1') : get_translation('CONFIRM_MEMBER_DELETE_2_2'))+get_translation('CONFIRM_MEMBER_DELETE_3'));

                    if(r == true)
                    {
                        delete_members();
                    }
                    else
                    {
                        return;
                    }
                }
            }

            function delete_members()
            {
                if(deletion_list.indexOf(gllConnectionsData.userId) > -1)
                {
                    deletion_list.splice(deletion_list.indexOf(gllConnectionsData.userId),1);
                }

                for(var i = 0; i < deletion_list.length; i++)
                {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function()
                    {
                        if(this.readyState == 4 && this.status == 200)
                        {
                            console.log("200 OK");
                        }

                        if(deletion_list.length == i)
                        {
                            document.getElementById('delete_community_members_modal').style.width = '350px';
                            document.getElementById('delete_community_members_modal').style.height = '100px';
                            document.getElementById('delete_community_members_modal').style.margin = '-50px 0 0 -160px';
                            document.getElementById('delete_community_members_modal').innerHTML = '<div style="font-size:26px;text-align:center;line-height:100px;">Done</div>';
                            setTimeout(function(){
                                console.log("Reloading");
                                location.reload();
                            },1200);
                        }
                    };
                    xhttp.open("DELETE", '/communities/service/atom/forms/community/members?communityUuid='+resourceId+'&userid='+deletion_list[i], true);
                    xhttp.send();
                }
            }

            function add_listeners()
            {
                document.getElementById('roleFilter').addEventListener('change',display_mass_delete_button,false);
                document.getElementById('saveButton').addEventListener('click',display_mass_delete_button,false);
                document.querySelector('#memberInviteForm input[name="submit"][type="button"]').addEventListener('click',display_mass_delete_button,false);
            }

            if(window.location.hash.startsWith('#fullpageWidgetId=Members'))
            {
                display_mass_delete_button();
            }
            else if(window.location.pathname.startsWith('/communities/service/'))
            {
                if(document.getElementById('Members_navItem'))
                {
                    document.getElementById('Members_navItem').addEventListener('click',display_mass_delete_button,false);
                }
            }
        }

    }, false);
}

var ccet = {

    "version"   : "0.031",
}