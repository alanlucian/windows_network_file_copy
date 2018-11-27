const path = require('path');
var cmd = require('node-cmd');
var fs = require('fs');

const minimist = require('minimist');
var args = minimist(process.argv.slice(2), {  
    alias: {
        f: 'file'	
    }
});

var networkData = JSON.parse(fs.readFileSync(args.file, 'utf8'));

const startDate = new Date();
const BKP_TIMESTAMP =  `${startDate.getFullYear()}${startDate.getMonth()}${startDate.getDate()}_${startDate.getHours()}${startDate.getMinutes()}${startDate.getSeconds()}` ;

console.log('Bkp folder sufix timestamp ' , BKP_TIMESTAMP);

cmd.get('net use',(err, data, stderr)=>{
    //console.log(err, data, stderr);
});


let completeCopyCount = 0;

for( var i = 0 ; i < networkData.destiny.length ;  i++  ){

    let copyToPath = path.sep+path.sep +  networkData.destiny[i].ip +  ( !networkData.destiny[i].hasOwnProperty('path') ?   networkData.globalPath : networkData.destiny[i].path ) ;
    let bkpToPath = path.sep+path.sep +  networkData.destiny[i].ip +  ( !networkData.destiny[i].hasOwnProperty('bkpPath') ?   networkData.globalBkpPath : networkData.destiny[i].bkpPath ) ;
    var authCmd = '';
    if( networkData.destiny[i].hasOwnProperty('auth') ){
        var authData = networkData.destiny[i].auth == 'global' ?   networkData.globalAuth : networkData.destiny[i].auth;
        var user = authData.user;
        var pwd = authData.pwd;
        authCmd = `net use ${copyToPath}  /USER:${user} ${pwd} && `;
    }
    let bkpFolder = bkpToPath + path.sep + `bkp_${BKP_TIMESTAMP}` ;
    cmd.get(`mkdir ${bkpFolder} `, (err, data, stderr)=>{
        //var moveCmd = `xcopy  ${copyToPath}${path.sep}*  ${bkpFolder}\\ `; WORK NO DIR
        var bkpCmd = `xcopy  ${copyToPath}  ${bkpFolder}  /Z /Y /S /J`;
        
        console.log( `Running BKP [${bkpCmd}]` );
        cmd.get(bkpCmd, (err, data, stderr)=>{
            if( err != null){
                console.log('>>>',err,data,stderr);
                return;
            }
            var copyCmd = authCmd +  "xcopy "+ networkData.origin +" " + copyToPath + " /Z /Y /S /J";
            console.log( `Running Cópia [${copyCmd}]` );
            cmd.get(
                copyCmd,
                function(err, data, stderr){
                    if(err!=null){
                        console.log("!ERR!\n\n\t",err, data, stderr)
                    }else{
                        completeCopyCount++;
                        console.log( `COPY TO ${copyToPath} DONE ( ${completeCopyCount} / ${networkData.destiny.length} )`  )

                        if(completeCopyCount == networkData.destiny.length){
                            let now = new Date();
                            
                            var timeDiff = Math.abs(now.getTime() - startDate.getTime());
                            var diffSeconds = Math.ceil(timeDiff / (1000)); 

                            console.log("\n#### DONE");
                            console.log('BKP folder sufix used: ' , BKP_TIMESTAMP);
                            console.log( `Process done in ${diffSeconds} seconds` )
                        }
                    }
                    
                }
            )
        });
    });
    
    

}



