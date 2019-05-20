
### Exec params
- -f config json file

If none was given netConfig.json on same path of the execution will be fetched

> NOTE: windows path is very tricky pay attention on escaping bars

  
**Config file format and values**

 -- **origin**: where to take files from
 -- **globalAuth**: auth data with permission to read/write ( network user can be set )
 -- **globalPath**: path on destity to copy data 
 -- **globalBkpPath**: path on destity make an BKP before copy
 -- **destiny**: list of targets to receive the content from origin ( each destiny can have specific paths and auth data )
	 
 

    {
        "origin":"\"E:\\repos\\networkUpdater\"",
        "globalAuth":{"user":"administrator","pwd":"\"\""},
        "globalPath":"\\c\\netWorkUpdate",
        "globalBkpPath":"\\c\\netWorkUpdate_BKP",
        "destiny":[
            {
                "ip":"127.0.0.1",
                "path":"\\c\\netWorkUpdate",
                "bkpPath":"\\c\\netWorkUpdate_BKP"
            },
            {"ip":"127.0.0.2"}
        ]
    }
