@ECHO OFF
CLS

CALL tns plugin remove nativescript-bitmap-factory

CD ..
CD plugin
ECHO Rebuild plugin...
CALL tsc
ECHO Done

CD ..
CD demo

CALL tns plugin add ..\plugin

CALL tns livesync --watch
