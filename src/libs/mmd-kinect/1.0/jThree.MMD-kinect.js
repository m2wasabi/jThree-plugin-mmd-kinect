/**
 * jThree.MMD-kinect.js JavaScript Library v1.0.0
 * http://www.jthree.com/
 * Created by m2wasabi on 2014/12/10.
 *
 * requires jQuery.js
 * requires jThree.js 2.0.0
 * requires jThree.MMD.js 1.4.1
 *
 * The MIT License
 *
 * Copyright (c) 2014 Matsuda Mitsuhide, katwat and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: 2014-12-10
 */

jThree.MMD.kinect = {
    init:function(mmd,kinectBoneList,startJoints){
        this.mmd = mmd.three(0);
        var bones = this.bones = this.mmd.children[ 0 ].bones;
        this.kinectBoneList = kinectBoneList;
        this.startJoints = startJoints;
        // bone <-> kinect index 変換表作成
        $.each( this.kinectBoneList,function(key,val){
            bones.forEach(function(bone,idx){
                if(bone.name===val.name){
                    val.index=idx;
                    return false;
                }
            });
        });
    },
    pose:function(kinectData){
        var vec = new THREE.Vector3();
        var vec2 = new THREE.Vector3();
        var data = kinectData;
        var mmd = this.mmd;
        var bones = this.bones;
        var list = this.kinectBoneList;

        vec.copy(data.SpineBase).multiplyScalar(13);
        // 左手系 <-> 右手系変換
        vec.z=-vec.z;
        mmd.localToWorld(vec);
        bones[ 0 ].parent.updateMatrixWorld();
        bones[ 0 ].parent.worldToLocal( vec);
        bones[ 0 ].position.copy(vec);

        // 立方体の位置をキネクトにあわせる
        var n=0;
        $.each(data,function(key,val){
            //red
            vec.copy(this).multiplyScalar(13);
            // 左手系 <-> 右手系変換
            vec.z=-vec.z;
            mmd.localToWorld(vec);
        });

        this.startJoints.forEach(function(key,idx){

            var bone;
            var child;

            while ( list[key].child ) {
                bone = bones[list[key].index];
                child = data[list[key].child];

                // Kinect座標データを取得、右手系、親ボーンのローカル座標に変換してから、差分を取得
                vec.copy(child);
                vec.z=-vec.z;
                bone.parent.worldToLocal(vec);
                vec2.copy(data[key]);
                vec2.z=-vec2.z;
                bone.parent.worldToLocal(vec2);
                vec.subVectors( vec,vec2);

                // モデル側 子ボーンの定義
                var bone_child = bones[list[list[key].child].index];
                // 法線ベクトルの定義
                var vecVertical = new THREE.Vector3();
                // 代入用のボーンベクトルの定義
                var boneVector = new THREE.Vector3();
                boneVector.copy( bone_child.position );

                // 各ベクトルの正規化
                boneVector.normalize();
                vec.normalize();

                // ボーンのクォータニオンを求める。 参照：http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final
                // ベクトルの内積により回転要素を算出
                var r = boneVector.dot( vec ) + 1;
                if(r < 0.000001) {
                    // 内積が0の誤差範囲の場合、法線はz軸かx軸に垂直である とする
                    r = 0;
                    if ( Math.abs( boneVector.x ) > Math.abs( boneVector.z ) ) {
                        v1.set( - boneVector.y, boneVector.x, 0 );
                    } else {
                        v1.set( 0, - boneVector.z, boneVector.y );
                    }
                } else {
                    // Kinectの差分から算出したボーン目標ベクトルと元ボーンの法線を算出
                    vecVertical.crossVectors(boneVector, vec );
                }

                // クォータニオンに法線ベクトルと回転を代入
                bone.quaternion.set(vecVertical.x, vecVertical.y, vecVertical.z,r);
                // クォータニオンを正規化
                bone.quaternion.normalize();

                // ボーンのマトリクスをワールド座標に反映
                bone.parent.updateMatrixWorld(true);

                key = list[key].child;
            }
        });


    }
};
