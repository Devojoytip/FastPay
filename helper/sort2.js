let d = {}
let arr = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
let arr2 = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'];

let rank = 1
for(let i =0; i<arr.length; i++){
    d[arr[i]] = rank++;
}
for(let i =0; i<arr2.length; i++){
    d[arr2[i]] = rank++;
}
function split_words(a){
    temp = []
    console.log('a ',a)
    for(let i=0;i<a.length;i++){
        unicode = a.charCodeAt(i);
        if(unicode >= 3006 && unicode <= 3022){
            temp[temp.length - 1] += a[i]
        }
        else{
            temp.push(a[i])
        }
    }
    return temp
}

function compare(aa,bb){
    let a = aa.itemNameHindi
    let b = bb.itemNameHindi
    console.log('a ',a)
    console.log('b ',b)
    a_letters = split_words(a)
    b_letters = split_words(b)
    for(let i=0;i<Math.min(a_letters.length,b_letters.length);i++){
        if(a_letters[i] != b_letters[i]){
            if(d[a_letters[i]] == undefined || d[b_letters[i]] == undefined){
                if(a_letters[i].length==1 || b_letters[i].length == 1){
                    if(a_letters[i][0] == b_letters[i][0]){
                        let idx1 = a_letters[i].length-1;
                        let idx2 = b_letters[i].length-1;
                        return a_letters[i].charCodeAt(idx1) - b_letters[i].charCodeAt(idx2);
                    }
                    return d[a_letters[i][0]] - d[b_letters[i][0]]
                }

                if(a_letters[i].charCodeAt(0) == b_letters[i].charCodeAt(0)){
                    if(a_letters[i].charCodeAt(1) == b_letters[i].charCodeAt(1)){
                        continue;
                    }
                    else{
                        if(a_letters[i].charCodeAt(1) == 3021){
                            return -1
                        }
                        if(b_letters[i].charCodeAt(1) == 3021){
                            return 1
                        }
                        return a_letters[i].charCodeAt(1) - b_letters[i].charCodeAt(1)
                    }
                }
                else{
                    return d[a_letters[i][0]] - d[b_letters[i][0]]
                }
            }
            else{
                return d[a_letters[i]] - d[b_letters[i]]
            }
        }
    }

    return a_letters.length - b_letters.length;
}


module.exports = compare;