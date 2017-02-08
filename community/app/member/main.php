<?php

if (!defined('IN_ANWSION'))
{
	die;
}

class main extends AWS_CONTROLLER
{

	function index_action(){

		if (is_digits($_GET['topic']))
		{
			if (!$topic_info = $this->model('topic')->get_topic_by_id($_GET['topic']))
			{
				$topic_info = $this->model('topic')->get_topic_by_title($_GET['topic']);
			}
		}
		else if (!$topic_info = $this->model('topic')->get_topic_by_title($_GET['topic']))
		{
			$topic_info = $this->model('topic')->get_topic_by_url_token($_GET['topic']);
		}

		if (!$topic_info)
		{
			HTTP::error_404();
		}

		$member_list = $this->model('topic')->get_focus_users_page_by_topic($topic_info['topic_id'],$_GET['page'],get_setting('contents_per_page'));

		$focus_users_total = $this->model('topic')->focus_users_total;


		TPL::assign('member_list', $member_list);

		TPL::assign('topic_info', $topic_info);

		TPL::assign('content_nav_menu', $this->model('menu')->get_nav_menu_list());

		$posts_list = $this->model('posts')->get_category_article($topic_info['topic_id']);

		TPL::assign('posts_list',$posts_list);

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/member/topic-' . $topic_info['topic_id']),
			'total_rows' => $focus_users_total,
			'per_page' => get_setting('contents_per_page')
		))->create_links());

		TPL::output('member/index');

	}
}