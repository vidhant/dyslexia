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
    else if (e.target.classList.contains("clear"))
    {
        modesController.uncheckAll();
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });

        gettingActiveTab.then((tabs) =>
        {
            browser.tabs.sendMessage(tabs[0].id, { mode: "clear", action: undefined });
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
    try
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
        var getting = browser.storage.local.get("dyslexiaExtensionMode");
        getting.then((returned) =>
        {
            if (returned != undefined)
            {
                this.SetCurrentMode(returned.dyslexiaExtensionMode);
            }
            else
            {
                SetCurrentMode("none");
            }
        });
    }
    catch (err)
    {
        alert("Error in : ModesController!" + err.message);
    }
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

            this.SetCurrentMode(mode);
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
            this.SetCurrentMode("none");
            browser.tabs.sendMessage(tabs[0].id, { mode: mode, action: "remove" });
        }
        catch (err)
        {
            alert("Error in : switchTurnedOff!" + err.message);
        }
    });
}

ModesController.prototype.uncheckAll = function ()
{
    try
    {
        if (this.selectedMode != "none")
        {
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
    }
    catch (err)
    {
        alert("Error in : uncheckAll!" + err.message);
    }
}

ModesController.prototype.checkThis = function (mode)
{
    try
    {
        if (mode != "none")
        {
            var options = document.getElementsByTagName("input");
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value === mode)
                {
                    options[i].checked = true;
                }
            }
            this.switchStates[this.selectedMode] = "on";
        }
    }
    catch (err)
    {
        alert("Error in : checkThis!" + err.message);
    }
}

ModesController.prototype.load = function ()
{
    if (this.selectedMode === "none")
    {
        return;
    }
    else
    {
        alert("wow");
        var options = document.getElementsByTagName("input");
        for (var i = 0; i < options.length; i++)
        {
            if (options[i].value === this.selectedMode)
            {
                options[i].checked = true;
            }
        }
    }
}

ModesController.prototype.SetCurrentMode = function (mode)
{
    this.selectedMode = mode;
    browser.storage.local.set({
        dyslexiaExtensionMode: mode
    });
    this.checkThis(mode);
}