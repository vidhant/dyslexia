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

var modesController = new ModesController();

document.addEventListener("DOMContentLoaded", (e) =>
{

});

document.addEventListener("click", (e) =>
{
    if (e.target.checked != undefined)
    {
        if (e.target.checked === false)
        {
            modesController.switchTurnedOff(e.target.value);
        }
        else
        {
            modesController.switchTurnedOn(e.target.value);
        }
    }
    else if (e.target.classList.contains("mode"))
    {
        var chosenMode = e.target.value;

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


function ModesController()
{
    this.switchStates =
    {
        "flicker": "off",
        "mirrorTheLetters": "off",
        "upsideDown": "off",
        "blur": "off",
        "zoomInZoomOut": "off",
        "bounce": "off",
        "bounceAndZoomInZoomOut": "off",
        "none": "on"
    };
    this.selectedMode = "none";
}

ModesController.prototype.switchTurnedOn = function (mode)
{
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) =>
    {
        try
        {
            if (this.selectedMode != "none")
            {
                // Remove the existing mode
                browser.tabs.sendMessage(tabs[0].id, { mode: this.selectedMode, action: "remove" });

                var options = document.getElementsByTagName("input");
                for (var i = 0; i < options.length; i++)
                {
                    if (options[i].value === this.selectedMode)
                    {
                        options[i].checked = false;
                    }
                }
                this.switchStates[this.selectedMode] = "off";
            }

            this.selectedMode = mode;
            this.switchStates[this.selectedMode] = "on";
            browser.tabs.sendMessage(tabs[0].id, { mode: mode, action: "apply" });
        }
        catch (err)
        {
            alert("Error in : switchTurnedOn!" + err.message);
        }
    });
}

ModesController.prototype.switchTurnedOff = function (mode)
{
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) =>
    {
        try
        {
            this.switchStates[mode] = "off";
            this.selectedMode = "none";
            browser.tabs.sendMessage(tabs[0].id, { mode: mode, action: "remove" });
        }
        catch (err)
        {
            alert("Error in : switchTurnedOff!" + err.message);
        }
    });
}