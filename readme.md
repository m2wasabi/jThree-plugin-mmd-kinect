# jThree-plugin-mmd-kinect

### jThree plugin MMD-kinect 1.0.0

### Overview

Kinect joint data import into MMD model

--------

### Usage

load this library in html after `jThree.MMD.js`

example)  

````html
<script src="libs/jquery/2.0.0/jquery.min.js"></script>
<script src="libs/jthree/2.1/jThree.min.js"></script>
<!--jThree plugins-->
<script src="libs/stats/1.2/jThree.Stats.js"></script>
<script src="libs/trackball/1.4/jThree.Trackball.js"></script>

<script src="libs/mmd/1.4/jThree.MMD.js"></script>
<script src="libs/mmd-kinect/1.0/jThree.MMD-kinect.js"></script>
<!--/jThree plugins-->
````

--------

### Functions
##### jThree.mmd.kinect.init(MMD, jointList, startJoints)
Make MMD bones correlated with Kinect joints.

> params
<dl>
<dt>MMD</dt><dd>jThree MMD Object  
example) `jThree("mmd#miku")`
</dd>
<dt>jointList</dt><dd>JSON object  
Kinect joint tree associated MMD bones
example)  
```json
{
  SpineMid: {
    name: "上半身",
    child: "Neck"
  },
  ...
}
```
</dd>
<dt>startJoints</dt><dd>Array  
Kinect joint names that bone trace begin  
example)  
```json
["SpineMid","ShoulderLeft","ShoulderRight","HipLeft","HipRight"]
```

</dd>
</dl>

##### jThree.mmd.kinect.pose(bodyinfo)
Apply Kinect pose into MMD model

> params  
<dl>
<dt>bodyinfo</dt><dd>JSON object  
Kinect bodyinfo in a frame  
example)  
```json
{
      "SpineBase": {
        "x": "0.1166515",
        "y": "-0.05276975",
        "z": "1.599339"
      },
      ...
}
```

</dd>
</dl>
