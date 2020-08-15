
function parseSkills(data){
    var res = []
    var skillTypesCount = 0;
    console.log(data,"start process")
    for (x=0;x<data.length;x++){
        if(x==0){
            var skillType = data[x].skillTypeName;
            var val = {};
            val[skillType] =[data[x].skillName];
            res.push(val)

        }else if(data[x].skillTypeName == data[x-1].skillTypeName){
            res[skillTypesCount][data[x].skillTypeName].push(data[x].skillName)
        }else{
            skillTypesCount++;
            var skillType = data[x].skillTypeName;
            var val = {};
            val[skillType] =[data[x].skillName];
            res.push(val)
        }
    }
    return res;
}

function parseRoles(data){
    var res = []
    var roleTypesCount = 0;
    console.log(data,"start process")
    for (x=0;x<data.length;x++){
        if(x==0){
            var roleType = data[x].roleTypeName;
            var val = {};
            val[roleType] =[data[x].roleName];
            res.push(val)

        }else if(data[x].roleTypeName == data[x-1].roleTypeName){
            res[roleTypesCount][data[x].roleTypeName].push(data[x].roleName)
        }else{
            roleTypesCount++;
            var roleType = data[x].roleTypeName;
            var val = {};
            val[roleType] =[data[x].roleName];
            res.push(val)
        }
    }
    return res;
}

function parseIndustry(data){
    var res =[];
    for (x=0;x<data.length;x++){
        res.push(data[x].industryName)
    }
    return res;
}
module.exports = {parseRoles,parseIndustry,parseSkills}