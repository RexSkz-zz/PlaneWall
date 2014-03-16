<?php
	if(!defined("IN_DISCUZ"))
		exit("Access denied!");

	require_once libfile('function/discuzcode');
	
	$tid = isset($_GET['tid']) ? $_GET['tid'] : $WallID;
	$maxReturn = isset($_GET['max']) ? $_GET['maxReturn'] : 50;
	$lastpos = isset($_GET['lastpos']) ? $_GET['lastpos'] : 0;

	$sql = "SELECT dateline,authorid,position,message,author FROM ".DB::table("forum_post").
		" WHERE tid = '$tid' AND position > $lastpos ORDER BY position";

	$result = DB::fetch_all($sql);

	if (empty($result))	exit("empty");

	while (count($result,0) >= $maxReturn && $lastpos == 0) {
		array_shift($result);
	}

	$sql="select * from ".DB::table("common_smiley")." where type='smiley'";
	$smile=DB::fetch_all($sql);
	$sql="select * from ".DB::table("forum_imagetype");
	$imgtype=DB::fetch_all($sql);

	foreach ($result as $k2=> $r) {
		$r['message']=discuzcode($r['message'], 0, 0, 1);
		$resultAft[$k2]=$r;
	}

	include template("PlaneWall:ajax");
	exit();
?>
