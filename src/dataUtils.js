const utils = { 
  to(promise) {
    return promise
      .then(data => {
        return [null, data];
      })
      .catch(err => [err]);
  },

  async httpReq(link) {
    let err, resp;
    [err, resp] = await this.to(fetch(link));
    if (resp) {
      [err, resp] = await this.to(resp.json());
      return resp;
    } else log.debug(JSON.stringify(err));
  },
}

let naicsUpperLevel = [11, 21, 22, 23, 31-33, 42, 44-45, 48-49, 51, 52, 53, 54, 55, 56, 61, 62, 71, 72, 81, 92];

let naicsIndustryLevel = [1111, 1112, 1113, 1114, 1119, 1121, 1122, 1123, 1124, 1125, 1129,
1131, 1132, 1133, 1141, 1142, 1151, 1152, 1153, 2111, 2121, 2122, 2123, 2131, 2211, 2212,
2213, 2361, 2362, 2371, 2372, 2373, 2379, 2381, 2382, 2383, 2389, 3111, 3112, 3113, 3114,
3115, 3116, 3117, 3118, 3119, 3121, 3122, 3131, 3132, 3133, 3141, 3149, 3151, 3152, 3159,
3161, 3162, 3169, 3211, 3212, 3219, 3221, 3222, 3231, 3241, 3251, 3252, 3253, 3254, 3255,
3256, 3259, 3261, 3262, 3271, 3272, 3273, 3274, 3279, 3311, 3312, 3313, 3314, 3315, 3321,
3322, 3323, 3324, 3325, 3326, 3327, 3328, 3329, 3331, 3332, 3333, 3334, 3335, 3336, 3339,
3341, 3342, 3343, 3344, 3345, 3346, 3351, 3352, 3353, 3359, 3361, 3362, 3363, 3364, 3365,
3366, 3369, 3371, 3372, 3379, 3391, 3399, 4231, 4232, 4233, 4234, 4235, 4236, 4237, 4238,
4239, 4241, 4242, 4243, 4244, 4245, 4246, 4247, 4248, 4249, 4251, 4411, 4412, 4413, 4421,
4422, 4431, 4441, 4442, 4451, 4452, 4453, 4461, 4471, 4481, 4482, 4483, 4511, 4512, 4521,
4529, 4531, 4532, 4533, 4539, 4541, 4542, 4543, 4811, 4812, 4821, 4831, 4832, 4841, 4842,
4851, 4852, 4853, 4854, 4855, 4859, 4861, 4862, 4869, 4871, 4872, 4879, 4881, 4882, 4883,
4884, 4885, 4889, 4911, 4921, 4922, 4931, 5111, 5112, 5121, 5122, 5151, 5152, 5171, 5172,
5174, 5179, 5182, 5191, 5211, 5221, 5222, 5223, 5231, 5232, 5239, 5241, 5242, 5251, 5259,
5311, 5312, 5313, 5321, 5322, 5323, 5324, 5331, 5411, 5412, 5413, 5414, 5415, 5416, 5417,
5418, 5419, 5511, 5611, 5612, 5613, 5614, 5615, 5616, 5617, 5619, 5621, 5622, 5629, 6111,
6112, 6113, 6114, 6115, 6116, 6117, 6211, 6212, 6213, 6214, 6215, 6216, 6219, 6221, 6222,
6223, 6231, 6232, 6233, 6239, 6241, 6242, 6243, 6244, 7111, 7112, 7113, 7114, 7115, 7121,
7131, 7132, 7139, 7211, 7212, 7213, 7223, 7224, 7225, 8111, 8112, 8113, 8114, 8121, 8122,
8123, 8129, 8131, 8132, 8133, 8134, 8139, 8141, 9211, 9221, 9231, 9241, 9251, 9261, 9271,
9281]

let statesFIPS = 
    {
     "01": "Alabama",
     "02": "Alaska",
     "04": "Arizona",
     "05": "Arkansas",
     "06": "California",
     "08": "Colorado",
     "09": "Connecticut",
     "10": "Delaware",
     "11": "District of Columbia",
     "12": "Florida",
     "13": "Geogia",
     "15": "Hawaii",
     "16": "Idaho",
     "17": "Illinois",
     "18": "Indiana",
     "19": "Iowa",
     "20": "Kansas",
     "21": "Kentucky",
     "22": "Louisiana",
     "23": "Maine",
     "24": "Maryland",
     "25": "Massachusetts",
     "26": "Michigan",
     "27": "Minnesota",
     "28": "Mississippi",
     "29": "Missouri",
     "30": "Montana",
     "31": "Nebraska",
     "32": "Nevada",
     "33": "New Hampshire",
     "34": "New Jersey",
     "35": "New Mexico",
     "36": "New York",
     "37": "North Carolina",
     "38": "North Dakota",
     "39": "Ohio",
     "40": "Oklahoma",
     "41": "Oregon",
     "42": "Pennsylvania",
     "44": "Rhode Island",
     "45": "South Carolina",
     "46": "South Dakota",
     "47": "Tennessee",
     "48": "Texas",
     "49": "Utah",
     "50": "Vermont",
     "51": "Virginia",
     "53": "Washington",
     "54": "West Virginia",
     "55": "Wisconsin",
     "56": "Wyoming"
  };


// https://api.census.gov/data/2016/cbp?get=ESTAB,PAYANN,NAICS2012_TTL,GEO_TTL&for=state:53&NAICS2012=31-33

let concatNAICS = (listNAICSCodes) => {
  return listNAICSCodes
            .map(elm => `&NAICS=${elm}`)
            .join('');
}

console.log(concatNAICS(naicsUpperLevel));

async function dataForState(state, listNAICS) { 
  let concatedNAICS = 
  let allData = await utils.httpReq(`https://api.census.gov/data/2016/cbp?get=EMP,PAYANN,NAICS2012_TTL,GEO_TTL&for=state:${state}${concatNAICS(listNAICS)}&key=080880c1f4f1baa14d83b94ab838b3f7169cd53e`)
          .then(data => {
            if (data) {
              //console.log(data[1]);
              return data[1];
            }
        })
  };
  
  console.log(allData)
  /*
  return allData.reduce((acc, elm) => {
    if (elm) {
      let [emp, payAnn, industry, _, industryNum, stateNum] = elm;
      acc.industries[industryNum] = {
        'name': industry,
        'emp': emp, 
        'payAnn': payAnn
      };
    }
    return acc;
    }, {'state': state, 'industries': {}
  });
*/
  allData = allData.filter(elm => elm !== undefined);
  return allData.sort((a, b) => {
    return b[0] - a[0]
  })
}

dataForState('53',naicsUpperLevel).then(data => console.log(data))