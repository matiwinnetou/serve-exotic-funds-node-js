## serve-exotic-funds-node-js
Express app to serve exotic funds as json

## Running
```
node serve-exotic-funds-node-js.js
```
and then
```
curl http://localhost:3000
```

## Example:
```
time curl https://kokosz.nerdpol.ovh:8086/ | jq "."
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   147  100   147    0     0     97      0  0:00:01  0:00:01 --:--:--    97
{
  "Legal_and_General_US_Index_Trust_C_Class": 561.9,
  "Smith_and_Williamson_Global_Gold_and_Resources_Inclusive_Class_A_Income_GBP": 1.7069999999999999
}

real	0m1.535s
user	0m0.028s
sys	0m0.018s
```
