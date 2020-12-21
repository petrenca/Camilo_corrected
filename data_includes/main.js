

PennController.ResetPrefix(null); // Shorten command names (keep this line here)
// PennController.DebugOff() // use for the final version

// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'


//Create picking function; needed for breaks
function Pick(set,n) {
    assert(set instanceof Object, "First argument of pick cannot be a plain string" );
    n = Number(n);
    if (isNaN(n) || n<0) 
        n = 0;
    this.args = [set];
    this.runSet = null;
    set.remainingSet = null;
    this.run = arrays => {
        if (this.runSet!==null) return this.runSet;
        const newArray = [];
        if (set.remainingSet===null) {
        if (set.runSet instanceof Array) set.remainingSet = [...set.runSet];
        else set.remainingSet = arrays[0];
    }
        for (let i = 0; i < n && set.remainingSet.length; i++)
            newArray.push( set.remainingSet.shift() );
    this.runSet = [...newArray];
    return newArray;
}
}
    function pick(set, n) { return new Pick(set,n); }
        
        critical = randomize("critical_trials");

PennController.Sequence("introduction","consent", "instructions","startpractice", "practiceblock", "beginblock1",
                        pick(critical,18),"beginblock2",
                        pick(critical,18),"beginblock3",
                        pick(critical,18), "exitform","send", "bye");


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
    .global()
    ,
    // Delay of 250ms before every trial
    newTimer(250)
    .start()
    .wait()
)
    .log( "Name" , getVar("ParticipantName") );
// This log command adds a column reporting the participant's name to every line saved to the results


newTrial( "intro" ,
          newText("<p>Welcome to the PCIbex demo experiment.</p><p>Please enter your name below and press Enter:</p>")
          .print()
          ,
          newTextInput()
          .print()
          .wait()                 // The next command won't be executed until Enter is pressed
          .setVar( "ParticipantName" )
          // This setVar command stores the value from the TextInput element into the Var element
         );

newTrial("introduction",
         newHtml("example_intro.html")
         .settings.log()
         .print(),
         newButton("button1", "continue")
         .print()
         .wait(),
         getButton("button1")
         .remove()
        );

newTrial("consent",
         newHtml("consentandinfo.html")
         .settings.log()
         .print(),
         newButton("button1", "continue")
         .print()
         .wait(),
         getButton("button1")
         .remove()
        );

newTrial("instructions",
         newHtml("instructions1", "instructionspage1.html")
         .print(),
         newKey(" ")
         .wait(),
         getHtml("instructions1")
         .remove(),
         newHtml("instructions2", "instructionspage2.html")
         .print(),
         newKey(" ")
         .wait(),
         getHtml("instructions2")
         .remove(),
         newHtml("instructions3", "instructionspage3.html")
         .print(),
         newKey(" ")
         .wait(),
         getHtml("instructions3")
         .remove(),
         newHtml("instructions4", "instructionspage4.html")
         .print(),
         newKey(" ")
         .wait(),
         getHtml("instructions4")
         .remove(),
         newHtml("instructions5", "instructionspage5.html")
         .print(),
         newKey(" ")
         .wait(),
         getHtml("instructions5")
         .remove()
        );

newTrial("startpractice",
         newText("space","Press the SPACEBAR to begin the practice session.")
         .settings.css("font-size", "x-large")
         .print(),
         newKey(" ")
         .wait(),
         getText("space")
         .remove()
        );

Template("PracticeBlock.csv" , row =>
         newTrial("practiceblock",
                  newText("sep", "+++ Ready? +++")
                  .settings.css("font-size", "x-large")
                  .print(),
                  newTimer(1000)
                  .start()
                  .wait()
                  .remove(),
                  getText("sep")
                  .remove(),
                  newController("DashedSentence", {s: row.Sentence , mode: "speeded acceptability",
                                                   wordTime : 200,
                                                   wordPauseTime : 40,
                                                   display: "in place"})
                  .settings.css("font-size", "x-large")
                  .print()
                  .wait(),
                  newText("frameD", " [ D ] ")
                  .settings.css("font-size", "xx-large")
                  .bold()
                  .css("border","display: inline-block", "width: 50px", "border: 1px solid #000","text-align : center")
                  .print(),
                  newText("frameK", " [ K ] ")
                  .settings.css("font-size", "xx-large")
                  .bold()
                  .print(),
                  newText("true", "True")
                  .italic()
                  .print(),
                  newText("false", "False")
                  .italic()
                  .print(),
                  newText("answer", "Press the key 'D' (True) or the key 'K' (False) to answer.")
                  .settings.css("font-size", "medium")
                  .italic()
                  .print(),
                  newCanvas("canvas1", 450,200)
                  .add(135 , 0 , getText("frameD"))
                  .add(155, 40 , getText("true"))
                  .add(300 , 0, getText("frameK"))
                  .add(320 , 40, getText("false"))
                  .add(80, 100, getText("answer"))
                  .print(),
                  newKey("DK")
                  .log()
                  .wait(),
                  getCanvas("canvas1")
                  .remove(),
                  newText("nextsentence", "Press the SPACEBAR for the next sentence.")
                  .settings.css("font-size", "x-large")
                  .print()
                  .log(),
                  newKey(" ")
                  .wait(),
                  getText("nextsentence")
                  .remove()
                 )
         .log("Item", row.Item)
        );

newTrial("beginblock1",
         newText("space","This marks the end of the practice session and the start of Block 1. Press the SPACEBAR to continue.")
         .settings.css("font-size", "x-large")
         .print(),
         
         newKey(" ")
         .wait(),
         getText("space")
         .remove()
        );

Template("master_list.csv" , row => PennController("critical_trials",
                                                   newText("sep", "+++ Ready? +++")
                                                   .settings.css("font-size", "x-large")
                                                   .print(),
                                                   newTimer(1000)
                                                   .start()
                                                   .wait()
                                                   .remove(),
                                                   getText("sep")
                                                   .remove(),
                                                   newController("DashedSentence", {s: row.sentence , mode: "speeded acceptability",
                                                                                    wordTime : 200,
                                                                                    wordPauseTime : 40,
                                                                                    display: "in place"})
                                                   .settings.css("font-size", "x-large")
                                                   .print()
                                                   .wait(),
                                                   newText("frameD", " [ D ] ")
                                                   .settings.css("font-size", "x-large")
                                                   .bold()
                                                   .print(),
                                                   newText("frameK", " [ K ] ")
                                                   .settings.css("font-size", "x-large")
                                                   .bold()
                                                   .print(),
                                                   newText("true", "True")
                                                   .italic()
                                                   .print(),
                                                   newText("false", "False")
                                                   .italic()
                                                   .print(),
                                                   newText("answer", "Press the key 'D' (True) or the key 'K' (False) to answer.")
                                                   .settings.css("font-size", "medium")
                                                   .italic()
                                                   .print(),
                                                   newCanvas("canvas1", 450,200)
                                                   .add(135 , 0 , getText("frameD"))
                                                   .add(155, 40 , getText("true"))
                                                   .add(300 , 0, getText("frameK"))
                                                   .add(320 , 40, getText("false"))
                                                   .add(80, 100, getText("answer"))
                                                   .print(),
                                                   newKey("DK")
                                                   .log()
                                                   .wait(),
                                                   getCanvas("canvas1")
                                                   .remove(),
                                                   newText("nextsentence", "Press the SPACEBAR for the next sentence.")
                                                   .settings.css("font-size", "x-large")
                                                   .print()
                                                   .log(),
                                                   newKey(" ")
                                                   .wait(),
                                                   getText("nextsentence")
                                                   .remove()
                                                  )
         .log("Group", row.Group)
         //.log("Type", row.type)
         .log("Item", row.item)
         
        );

newTrial("beginblock2",
         newText("space","This marks the end of Block 1 and the start of Block 2. Press the SPACEBAR to continue.")
         .settings.css("font-size", "x-large")
         .print(),
         
         newKey(" ")
         .wait(),
         getText("space")
         .remove()
        );

newTrial("beginblock3",
         newText("space","This marks the end of Block 2 and the start of Block 3. Press the SPACEBAR to continue.")
         .settings.css("font-size", "x-large")
         .print(),
         
         newKey(" ")
         .wait(),
         getText("space")
         .remove()
         
        );

newTrial("exitform",  
         newHtml("debrief", "debrief.html")
         .print()
         .log(),
         newButton("Submit answers")
         .print()
         .wait(),
         getHtml("debrief")
         .remove()
        );

PennController.SendResults( "send" );

// Spaces and linebreaks don't matter to the script: we've only been using them for the sake of readability
newTrial( "bye" ,
          newText("Thank you for your participation!").print(),
          newButton().wait()  // Wait for a click on a non-displayed button = wait here forever
         )
    
    .setOption( "countsForProgressBar" , false )
    // Make sure the progress bar is full upon reaching this last (non-)trial
