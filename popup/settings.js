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
    if (e.target.classList.contains("mode"))
    {
        var chosenMode = e.target.textContent;

        //browser.tabs.executeScript(null, {
        //    file: "/content_scripts/dyslexia_working.js"
        //});

        console.log("Sending the message.");

        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });

        gettingActiveTab.then((tabs) =>
        {
            browser.tabs.sendMessage(tabs[0].id, { mode: chosenMode });
        });
    }
    else if (e.target.classList.contains("reset"))
    {
        browser.tabs.reload();
        window.close();
    }
});