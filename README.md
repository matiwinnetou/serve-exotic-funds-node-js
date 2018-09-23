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
[mati@wit ~]$ time curl localhost:3000 | jq "."
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   155  100   155    0     0     65      0  0:00:02  0:00:02 --:--:--    65
{
  "Schroder_Managed_Balanced_Inclusive_Class_H_Accumulation_GBP": 0.9941,
  "Smith_and_Williamson_Global_Gold_and_Resources_Inclusive_Class_A_Income_GBP": 1.761
}

real	0m2,402s
user	0m0,017s
sys	0m0,015s
```
