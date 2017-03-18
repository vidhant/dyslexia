var total = 0;
var allNodes = [];

function textNodesUnder(el){
  var n, walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode())
  {
    // n.parentNode.setAttribute("script","rotate.js")
    allNodes.push(n);
    //console.log(n.textContent);                                                                              
  }                                                     
}                                                                                 

function animateThisNodeNumber(el, nodeNumber)
{
  try
  {
    var count = 0;
    var n, walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode())
    {
      console.log(n.textContent);
      if(count==nodeNumber)
        break;
      count++;
    }

    console.log("count is : " + count + " and node number is : " + nodeNumber);
    var originalContent = n.textContent;
    n.textContent = "Vidhant";
    console.log("REVERTING : " + n.textContent + " TO " + originalContent);
    setTimeout(dummy, 2000);
    n.textContent = originalContent;
  }
  catch(err)
  {
    console.log("Error in : animateThisNodeNumber!");
    console.log(err.message);
  }
}

function getARandomNumber(maximum)
{
  // The largest this will return is maximum-1
  return Math.floor(Math.random()*maximum);
}

function dummy()
{
  console.log("Dummy mofo!");
}

function animate()
{
  try
  {
    // Pick a random node
    // Trip it out!
    var targetNodeNumber = getARandomNumber(10);
    animateThisNodeNumber(window.document.body, targetNodeNumber);
  }
  catch(err)
  {
    console.log("Error in : animate!");
    console.log(err.message);
  }
}

function main() {
  try
  {
    console.log("-----------------------Main-------------------------");
    //console.log(window.document.body.innerText);
    textNodesUnder(window.document.body);
    console.log("Extracted all textNodes. Nodes are a total of : " + allNodes.length);
    console.log("*************Animation will begin now***********");
    setInterval(animate, 4000);

    // console.log("nigga nigga");
    // console.log("The number of L-1 iframes is: " + window.length);
    // iterateOverIframes(window, 0);
    // total--; // reduce the window itself.
    // console.log("Total is " + total);
    console.log("------------QED---------");
  }
  catch(err)
  {
    console.log("Error!");
    console.log(err.message);
  }
}

function iterateOverIframes(root, count) 
{
  try
  {
    total++;
    var frames = root.frames;
    if(frames.length != 0)
    {
      // console.log("Called 2");
      var i;
      for (i = 0; i < frames.length; i++) 
      {
        // console.log("Called 3");
        iterateOverIframes(frames[i], count+1);
      }
    }
    if(root===window && !(root.innerText === undefined))
    {
      console.log("Logging innerText");
      console.log(root.innerText);
      return;
    }
    else
    {
      console.log("No innertext, showing location instead.");
      console.log(root.location);
      return
    }
    console.log(root.location);
    if(root===undefined)
    {

    }
    else
    {
      if(root.document==undefined)
      {

      }
      else
      {
        if(root.document.body===undefined)
        {

        }
        else
        {
          if(root.document.body.textContent===undefined)
          {

          }
          else
          {
            console.log("Logging textContent of body");
            console.log(root.document.body.textContent);
          }
        }
      }
    }
  }
  catch(err)
  {
    console.log(err.message);
  }
}

main();