var file = "print3d-ttyACM1.log"; 

var preserveFilters = [ /sendCode.*/,
                        /readCode.*/,
                        /Print 3D server/
                      ];
var removeFilters = 	[ /sendCode\(\): M105/,
                     	  /ok T.*/
                     	];
var replaceFilters = [ [/\d+-\d+\s\d+:\d+:\d+\s+\[\w+\]/,""],
                       ["sendCode():",">"],
                       ["readCode():","&nbsp;&nbsp;<"],
                       ["Print 3D server","=================================================================================="]
                      ];

$(function() {
	$.get(file, function( data ) {
		//console.log("data: ",data);
		var lines = data.split("\n");
		//lines = lines.splice(500,1000);
		var filteredLines = filter(lines);
		display(filteredLines);
	},"text");
});

function filter(lines) {
	lines = lines.concat(); // copy
	
	// preserve filters
	console.log("preserve");
	var filteredLines = [];
	jQuery.each(lines, function(index, line){
		jQuery.each(preserveFilters, function(filterIndex, regExp){
			if(regExp.test(line)) {
				filteredLines.push(line);
			}
		});
	});
	
	//remove filters
	console.log("remove");
	var filteredLines2 = [];
	jQuery.each(filteredLines, function(index, line){
		//console.log("  line: ",line);
		var remove = false;
		jQuery.each(removeFilters, function(filterIndex, regExp){
			var matches = line.match(regExp);
			//console.log("    matches: ",matches);
			if(matches !== null) remove = true;
		});
		if(!remove) filteredLines2.push(line);
		//console.log("    remove: ",remove);
	});
	
	// replace filters
	console.log("replace");
	jQuery.each(filteredLines2, function(index, line){
		//console.log("  line: ",line);
		jQuery.each(replaceFilters, function(filterIndex, replacePair){
			line = line.replace(replacePair[0],replacePair[1]);
		});
		filteredLines2[index] = line;
	});
	return filteredLines2;
}
function display(lines) {
	var html = lines.join("<br/>");
	$("body").html(html);
}