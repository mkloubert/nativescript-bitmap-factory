@ECHO OFF
CLS

CALL tns plugin remove nativescript-bitmap-factory

CD ..
CD plugin
ECHO Rebuild plugin...
CALL tsc
CALL tsc -d
ECHO Done

CD ..
CD demo

CALL tns plugin add ..\plugin

CALL tns livesync --watch
