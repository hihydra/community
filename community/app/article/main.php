<?php
/*
+--------------------------------------------------------------------------
|   WeCenter [#RELEASE_VERSION#]
|   ========================================
|   by WeCenter Software
|   © 2011 - 2014 WeCenter. All Rights Reserved
|   http://www.wecenter.com
|   ========================================
|   Support: WeCenter@qq.com
|
+---------------------------------------------------------------------------
*/


if (!defined('IN_ANWSION'))
{
	die;
}

class main extends AWS_CONTROLLER
{
	public function get_access_rule()
	{
		$rule_action['rule_type'] = 'white';

		if ($this->user_info['permission']['visit_question'] AND $this->user_info['permission']['visit_site'])
		{
			$rule_action['actions'][] = 'square';
			$rule_action['actions'][] = 'index';
		}

		return $rule_action;
	}

	public function index_action()
	{
		if ($_GET['notification_id'])
		{
			$this->model('notify')->read_notification($_GET['notification_id'], $this->user_id);
		}

		if (is_mobile())
		{
			HTTP::redirect('/m/article/' . $_GET['id']);
		}

		if (! $article_info = $this->model('article')->get_article_info_by_id($_GET['id']))
		{
			HTTP::error_404();
		}

		if ($article_info['has_attach'])
		{
			$article_info['attachs'] = $this->model('publish')->get_attach('article', $article_info['id'], 'min');

			$article_info['attachs_ids'] = FORMAT::parse_attachs($article_info['message'], true);
		}



		$article_info['user_info'] = $this->model('account')->get_user_info_by_uid($article_info['uid'], true);

		$article_info['message'] = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($article_info['message'])));

		if ($this->user_id)
		{
			$article_info['vote_info'] = $this->model('article')->get_article_vote_by_id('article', $article_info['id'], null, $this->user_id);
		}

		$article_info['vote_users'] = $this->model('article')->get_article_vote_users_by_id('article', $article_info['id'], 1, 10);

		//wl-add
		$category_info = $this->model('system')->get_category_info($article_info['category_id']);
		//wl-end

		$article_topics = $this->model('topic')->get_topics_by_item_id($article_info['id'], $category_info['type']);

		if ($article_topics)
		{
			TPL::assign('article_topics', $article_topics);

			foreach ($article_topics AS $topic_info)
			{
				$article_topic_ids[] = $topic_info['topic_id'];
			}
		}

		//wl-add 分类
		$article_info['category'] = $category_info;
		$article_info['category']['link'] = 'article/' . 'category-' . $article_info['category']['id'].'__topic-'.$topic_info['topic_id'];
		TPL::assign('content_nav_menu', $this->model('menu')->get_nav_menu_list());
		TPL::assign('topic_info',$topic_info);
		TPL::assign('article_info', $article_info);
		//wl-end

		TPL::assign('reputation_topics', $this->model('people')->get_user_reputation_topic($article_info['user_info']['uid'], $user['reputation'], 5));

		$this->crumb($article_info['title'], '/article/' . $article_info['id']);

		TPL::assign('human_valid', human_valid('answer_valid_hour'));

		if ($_GET['item_id'])
		{
			$comments[] = $this->model('article')->get_comment_by_id($_GET['item_id']);
		}
		else
		{
			$comments = $this->model('article')->get_comments($article_info['id'], $_GET['page'], 100);
		}

		if ($comments AND $this->user_id)
		{
			foreach ($comments AS $key => $val)
			{
				$comments[$key]['vote_info'] = $this->model('article')->get_article_vote_by_id('comment', $val['id'], 1, $this->user_id);
				$comments[$key]['message'] = $this->model('question')->parse_at_user($val['message']);

			}
		}

		if ($this->user_id)
		{
			TPL::assign('user_follow_check', $this->model('follow')->user_follow_check($this->user_id, $article_info['uid']));
		}

		TPL::assign('question_related_list', $this->model('question')->get_related_question_list(null, $article_info['title']));

		$this->model('article')->update_views($article_info['id']);

		TPL::assign('comments', $comments);
		TPL::assign('comments_count', $article_info['comments']);

		TPL::assign('human_valid', human_valid('answer_valid_hour'));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/article/id-' . $article_info['id']),
			'total_rows' => $article_info['comments'],
			'per_page' => 100
		))->create_links());

		TPL::set_meta('keywords', implode(',', $this->model('system')->analysis_keyword($article_info['title'])));

		TPL::set_meta('description', $article_info['title'] . ' - ' . cjk_substr(str_replace("\r\n", ' ', strip_tags($article_info['message'])), 0, 128, 'UTF-8', '...'));

		TPL::assign('attach_access_key', md5($this->user_id . time()));

		$recommend_posts = $this->model('posts')->get_recommend_posts_by_topic_ids($article_topic_ids);

		if ($recommend_posts)
		{
			foreach ($recommend_posts as $key => $value)
			{
				if ($value['id'] AND $value['id'] == $article_info['id'])
				{
					unset($recommend_posts[$key]);

					break;
				}
			}

			TPL::assign('recommend_posts', $recommend_posts);
		}
		TPL::output('article/index');
	}

	public function index_square_action()
	{
		if (is_mobile())
		{
			HTTP::redirect('/m/article/');
		}

		$this->crumb(AWS_APP::lang()->_t('文章'), '/article/');

		//wl-add 分类
		TPL::assign('content_nav_menu', $this->model('menu')->get_nav_menu_list());
		//wll -end

		if ($_GET['category'])
		{
			if (is_digits($_GET['category']))
			{
				$category_info = $this->model('system')->get_category_info($_GET['category']);
			}
			else
			{
				$category_info = $this->model('system')->get_category_info_by_url_token($_GET['category']);
			}
		}

		if ($_GET['feature_id'])
		{
			$article_list = $this->model('article')->get_articles_list_by_topic_ids($_GET['page'], get_setting('contents_per_page'), 'add_time DESC', $this->model('feature')->get_topics_by_feature_id($_GET['feature_id']));

			$article_list_total = $this->model('article')->article_list_total;

			if ($feature_info = $this->model('feature')->get_feature_by_id($_GET['feature_id']))
			{
				$this->crumb($feature_info['title'], '/article/feature_id-' . $feature_info['id']);

				TPL::assign('feature_info', $feature_info);
			}
		}
		//wll -add
		else if($_GET['topic']){
			$topic_id = $_GET['topic'];
			$topic_info = $this->model('topic')->get_topic_by_id($topic_id);
			TPL::assign('topic_info',$topic_info);
			$article_list = $this->model('article')->get_articles_list_by_topic_ids($_GET['page'],get_setting('contents_per_page'), 'add_time DESC',$topic_id,$category_info['id'],$category_info['type']);

			$article_list_total = $this->model('article')->found_rows();
		}
		//wll -end
		else
		{
			$article_list = $this->model('article')->get_articles_list($category_info['id'], $_GET['page'], get_setting('contents_per_page'), 'add_time DESC');

			$article_list_total = $this->model('article')->found_rows();
		}

		if ($article_list)
		{
			foreach ($article_list AS $key => $val)
			{
				$article_ids[] = $val['id'];

				$article_uids[$val['uid']] = $val['uid'];
			}

			$article_topics = $this->model('topic')->get_topics_by_item_ids($article_ids, 'article');
			$article_users_info = $this->model('account')->get_user_info_by_uids($article_uids);

			foreach ($article_list AS $key => $val)
			{
				$article_list[$key]['user_info'] = $article_users_info[$val['uid']];
			}
		}


		//边栏热门共同体
		if (TPL::is_output('block/sidebar_hot_topics.tpl.htm', 'article/square'))
		{
			TPL::assign('sidebar_hot_topics', $this->model('module')->sidebar_hot_topics($category_info['id']));
		}

		if ($category_info)
		{
			TPL::assign('category_info', $category_info);

			$this->crumb($category_info['title'], '/article/category-' . $category_info['id']);

			$meta_description = $category_info['title'];

			if ($category_info['description'])
			{
				$meta_description .= ' - ' . $category_info['description'];
			}

			TPL::set_meta('description', $meta_description);

			//wl -add
			if($category_info['parent_id']){
				$category_top_id = $category_info['parent_id'];
			}else{
				$category_top_id = $category_info['id'];
			}

			$category_navigation =  $this->model('system')->get_category_info($category_top_id);
			$category_navigation['link'] = 'article/' . 'category-' . $category_navigation['id'].'__topic-'.$topic_info['topic_id'];
			$category_navigation['child'] = $this->model('menu')->process_child_menu_links($this->model('system')->fetch_category($category_info['type'],$category_top_id),'article');
			TPL::assign('category_navigation', $category_navigation);
			//wl-end
		}

		TPL::assign('article_list', $article_list);
		TPL::assign('article_topics', $article_topics);

		TPL::assign('hot_articles', $this->model('article')->get_articles_list($category_info['id'], 1, 10, 'votes DESC',$topic_id,30));

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_js_url('/article/category-' . $_GET['category']. '__topic-' . $_GET['topic'] . '__feature_id-' . $_GET['feature_id']),
			'total_rows' => $article_list_total,
			'per_page' => get_setting('contents_per_page')
		))->create_links());

		TPL::output('article/square');
	}
}
