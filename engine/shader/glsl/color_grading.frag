#version 310 es

#extension GL_GOOGLE_include_directive : enable
#define resolution 16.0
#include "constants.h"
layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;


highp vec4 transfercoord(highp float x)
{
    highp float r=floor(x*resolution)/resolution;
    highp float g=ceil(x*resolution)/resolution;
    highp float b=1.0-(x-r)*resolution;
    highp float a=(x-r)*resolution;
    return vec4(r,g,b,a);
}

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;
    highp vec4 myuv=transfercoord(color.r);
    highp vec2 uv1=vec2(myuv.x+color.y/resolution,color.z);
    highp vec2 uv2=vec2(myuv.y+color.y/resolution,color.z);
     

    //out_color = texture(color_grading_lut_texture_sampler, uv1)*myuv.z+
    texture(color_grading_lut_texture_sampler, uv2)*myuv.w;
    out_color=color;
}
