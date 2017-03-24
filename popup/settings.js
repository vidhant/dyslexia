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

function Messenger(handleMessagesFromContentScript)
{
    this.registerHandler(handleMessagesFromContentScript);
}

Messenger.prototype.registerHandler = function (handler)
{
    browser.runtime.onMessage.addListener(handler);
}

/* Receives RESPONSE (i.e., BG initiated) messages from CS */
Messenger.prototype.handleResponse = function (message)
{
    alert("Called");
    alert(`Message from the content script:  ${message.response}`);
}

Messenger.prototype.handleError = function (error)
{
    alert(`Error in sending message to CS: ${error}`);
}

Messenger.prototype.handleInitializationMessages = function (incomingMessage)
{
    try
    {
        var currentCSS = incomingMessage.currentCSSMode;
        var isFlickerActive = incomingMessage.isFlickerActive;
        var flickerDuration = incomingMessage.flickerInterval;
        var animationProbability = incomingMessage.flickerAnimationProbability;

        if (currentCSS != undefined && currentCSS != "none")
        {
            modesController.switchTurnedOn(currentCSS);
        }

        if (isFlickerActive)
        {
            modesController.switchTurnedOn("flicker");
        }
    }
    catch (err)
    {
        alert("Error in : handleInitializationMessages!" + err.message);
    }
}

/* Sends messages to CS */
Messenger.prototype.sendMessageToContentScript = function (json)
{
    try
    {
        var self = this;
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true }, function (tabs)
        {
            var sending = browser.tabs.sendMessage(tabs[0].id, json, function (incomingMessage)
            {
                try
                {
                    if (incomingMessage.responseType === "responseToRequestingInitialization")
                    {
                        self.handleInitializationMessages(incomingMessage);
                    }
                }
                catch (err)
                {
                    alert("Error in : Handling Messages from CS!" + err.message);
                }
            });
        });
    }
    catch (err)
    {
        alert("Error in : Sending Message To CS!" + err.message);
    }
}

/* Handles message from CS */
function handleMessage(request, sender, sendResponse)
{
    alert("Message from the content script: " + request);
    sendResponse({ response: "Response from CS script." });
}

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
        messenger.sendMessageToContentScript({ mode: "clear", action: undefined });
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
    }
    catch (err)
    {
        alert("Error in : ModesController!" + err.message);
    }
}

ModesController.prototype.switchTurnedOn = function (mode)
{
    try
    {
        if (this.selectedMode != "none")
        {
            // Remove the existing mode
            messenger.sendMessageToContentScript({ mode: this.selectedMode, action: "remove" });

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
        messenger.sendMessageToContentScript({ mode: mode, action: "apply" });
    }
    catch (err)
    {
        alert("Error in : switchTurnedOn!" + err.message);
    }
}

ModesController.prototype.switchTurnedOff = function (mode)
{
    try
    {
        this.switchStates[mode] = "off";
        this.SetCurrentMode("none");
        messenger.sendMessageToContentScript({ mode: mode, action: "remove" });
    }
    catch (err)
    {
        alert("Error in : switchTurnedOff!" + err.message);
    }
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
    try
    {
        this.selectedMode = mode;
        this.checkThis(mode);
    }
    catch (err)
    {
        alert("Error in : SetCurrentMode!" + err.message);
    }
}

var messenger = new Messenger(handleMessage);
var modesController = new ModesController();

messenger.sendMessageToContentScript({ mode: "requestingInitialization" });