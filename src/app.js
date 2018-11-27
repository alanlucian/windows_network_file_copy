const path = require('path');
var fs = require('fs');

const minimist = require('minimist');
var args = minimist(process.argv.slice(2), {  
    alias: {
        f: 'file'	
    }
});

var networkData = JSON.parse(fs.readFileSync(args.file, 'utf8'));

var cmd=require('node-cmd');

const now = new Date();
const BKP_TIMESTAMP =  `${now.getFullYear()}${now.getMonth()}${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}` ;

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
        
        console.log( `Executando BKP [${bkpCmd}]` );
        cmd.get(bkpCmd, (err, data, stderr)=>{
            if( err != null){
                console.log('>>>',err,data,stderr);
                return;
            }
            var copyCmd = authCmd +  "xcopy "+ networkData.origin +" " + copyToPath + " /Z /Y /S /J";
            console.log( `Executando Cópia [${copyCmd}]` );
            cmd.get(
                copyCmd,
                function(err, data, stderr){
                    if(err!=null){
                        console.log("!ERR!\n\n\t",err, data, stderr)
                    }else{
                        completeCopyCount++;
                        console.log( `Cópia para ${copyToPath} concluída ( ${completeCopyCount} / ${networkData.destiny.length} )`  )

                        if(completeCopyCount == networkData.destiny.length){
                            console.log( 'ROTINA de Cópia com BK Concluída')
                        }
                    }
                    
                }
            )
        });
    });
    
    

}

console.log(BKP_TIMESTAMP);

