/*
Listen for clicks in the popup.

If the click is on one of the beasts:
Inject the "settings.js" content script in the active tab.

Then get the active tab and send "settings.js" a message
containing the URL to the chosen beast's image.

If it's on a button which contains class "clear":
  Reload the page.
  Close the popup. This is needed, as the content script malfunctions after page reloads.
*/

document.addEventListener("click", (e) =>
{
    if(e.target.checked != undefined)
    {
        var chosenMode = e.target.value;
        console.log("chosen mode is : " + chosenMode);

        if(chosenMode === "flicker")
        {
            var modes = document.getElementsByTagName("input");

            for(var i=0;i<modes.length;i++)
            {
                if(modes[i].value != "flicker")
                {
                    modes[i].style.visibility = "hidden";
                }
            }
        }

        var action = "apply";

        if(e.target.checked === false)
        {
            action = "remove";
        }

        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) =>
        {
            browser.tabs.sendMessage(tabs[0].id, { mode: chosenMode, action:  action});
        });
    }
    else if (e.target.classList.contains("mode"))
    {
        var chosenMode = e.target.value;
        console.log("Sending the message.");

        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });

        gettingActiveTab.then((tabs) =>
        {
            browser.tabs.sendMessage(tabs[0].id, { mode: chosenMode, action: undefined });
        });
    }
    else if (e.target.classList.contains("reset"))
    {
        browser.tabs.reload();
        window.close();
    }
});