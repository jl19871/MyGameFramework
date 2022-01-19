/*
 * @Author: JL
 * @Date: 2022-01-19 14:36:14
 */
import * as _ from "lodash";
import BaseUI from "../../../../base/BaseUI";
import ListView, { IListAdapter } from "../../../../component/ListView";
import { ENotifyType } from "../../../../data/const/NotifyConst";
import Game from "../../../../Game";
import { EViewName, IViewData } from "../../../../manager/UIManager";
import ListViewDemoItem from "./ListViewDemoItem";

const { ccclass, menu, property } = cc._decorator;

//TODO 快速修复错误，会在EViewName中添加对应的UI枚举
const VIEW_DATA: IViewData = {
	viewName: EViewName.UI_ListViewDemo,
	resDirs: ["demos/listdemo"],
	prefabUrl: "Prefab/UI/demos/listdemo/ListViewDemo", // ui界面prefab的位置
};

@ccclass
@menu("UI/demos/listdemo/UI_ListViewDemo")
export default class UI_ListViewDemo extends BaseUI implements IListAdapter {


	private listData = [];
	@property(ListView)
	listView: ListView = null;


	getItemCount(listView: ListView): number {
		return this.listData.length;
	}
	setItemData(listView: ListView, node: cc.Node, index: number): void {
		let data = this.listData[index];
		node.getComponent(ListViewDemoItem).setData(index, data);
	}
	getItemSize(listView: ListView, index: number): cc.Size {
		return cc.size(220, 80);
	}

	//初始化UI
	public initUI(data: Record<string, unknown>) {
		this.listView.setAdapter(this);
	}

	//界面显示开始
	protected onOpenStart() {

	}

	//界面显示完成
	protected onOpenEnd() {
		Game.NotifyManager.on(ENotifyType.DEMO_DEL_LISTITEM, this.delList, this);

		this.listData = ["你好", "好的", "为什么", "buyao"];
		this.listView.notifyDataSetChanged();
	}

	//界面关闭开始
	protected onCloseStart() {
		Game.NotifyManager.off(ENotifyType.DEMO_DEL_LISTITEM, this.delList, this);
	}

	//界面关闭完成
	protected onCloseEnd() {

	}

	public getViewData(): IViewData {
		return VIEW_DATA;
	}


	public delList(index) {
		// this.listData = _.slice(this.listData, index, index + 1);
		let data = this.listData[index];
		_.remove(this.listData, (i) => i === data);
		this.listView.animtedDelOneItem(index, 0.2, this.updateList.bind(this));
	}

	updateList() {
		this.listView.notifyDataSetChanged();
	}
}

// 必须注册UI 加载必要资源使用
Game.UIManager.registUI(VIEW_DATA, UI_ListViewDemo);