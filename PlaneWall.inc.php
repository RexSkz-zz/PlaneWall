<?php
	if (!defined('IN_DISCUZ'))
	{
		exit("...");
	}

	$plugPosi = "./source/plugin/PlaneWall";
	$WallID = isset($_GET['WallID']) ? $_GET['WallID'] : $_G['cache']['plugin']['PlaneWall']['WallID'];
	
	if(defined("IN_MOBILE"))
	{
		header("location:./forum.php?mod=viewthread&tid={$WallID}");
	}

	if (!isset($WallID))
	{
		echo "飞机墙并没有制订ID";
		exit(-1);
	}

	$actionArr = array('ajax');

	if (isset($_GET['action']) && in_array($_GET['action'],$actionArr))
	{
		$action = $_GET['action'];
		require_once "$plugPosi/$action.php";
	}

	include template("PlaneWall:PlaneWall");
?>
