<template>
  <div>
    <Form :label-width="60" inline>
      <FormItem label="状态：">
        <Select v-model="search.state" style="width: 150px">
          <Option :value="item.value" :key="item.value" v-for="item in stateOptions">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="搜索">
        <Input v-model="search.keyword" placeholder="请输入关键词"></Input>
      </FormItem>
      <Button type="primary" @click="handleSearch">搜索</Button>
      <Button type="default" style="margin-left: 10px" @click="handleWorks">写作品</Button>
    </Form>

    <Table :columns="table.header" :data="table.body"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="table.args.total_count"
              :current="table.args.current_page"
              :page-size="table.args.page_size"
              show-total @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "works-list",
    data() {
      return {
        search: {
          keyword: '',
          tag: -1,
          state: -1
        },
        stateOptions: [
          {
            name: '所有',
            value: -1
          },
          {
            name: '发布',
            value: 1
          },
          {
            name: '草稿',
            value: 0
          }
        ],
        table: {
          header: [
            {
              title: '作品标题',
              key: 'works_title'
            },
            {
              title: '创建日期',
              key: 'works_create_time',
              render: (h, params) => {
                return h('div', [
                  h('Span', {}, params.row.works_create_time)
                ]);
              }
            },
            {
              title: '修改日期',
              key: 'works_update_time',
              render: (h, params) => {
                return h('div', [
                  h('Span', {}, params.row.works_update_time)
                ]);
              }
            },
            {
              title: '标签',
              key: 'works_tags',
              render: (h, params) => {
                let a = null;
                if (params.row.works_tags.length) {
                  a = h('ul', params.row.works_tags.map((item, key) => {
                    return h('li', {
                      style: {
                        float: 'left'
                      },
                      attrs: {
                        title: item.tags_desc
                      }
                    }, key === params.row.works_tags.length - 1 ? item.tags_name : `${item.tags_name},`)
                  }))
                } else {
                  a = h('Span', '无')
                }

                return a;
              }
            },
            {
              title: '状态',
              key: 'works_state',
              render: (h, params) => {
                return h('div', [
                  h('Span', {}, this.formatState(params.row.works_state))
                ]);
              }
            },
            {
              title: '操作',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  }, '查看'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: 'create-works',
                          query: {
                            _id: params.row._id
                          }
                        })
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '提示',
                          content: '<p>确定删除？</p>',
                          onOk: async () => {
                            let res = await this.$api.worksInterface.deleteWorksById({_id: params.row._id});
                            let {msg} = res.data;
                            this.getWorksList();
                            return this.$Message.info(msg)
                          }
                        });
                      }
                    }
                  }, '删除')
                ]);
              }
            },
          ],
          body: [],
          args: {
            current_page: 1,
            page_size: 10,
            total_count: 0
          },
        },
        tagList: [],
      }
    },
    async created() {
      let res = await this.$api.tagsInterface.getTagsList();
      let {article_num_list = [], tags_list = []} = res.data.data;
      tags_list.forEach(item => {
        let temp = article_num_list.find(i => i._id === item._id);
        item.tags_article_num = temp == null ? 0 : temp.count;
      });

      this.tagList = tags_list.sort((a, b) => {
        return a.tags_article_num < b.tags_article_num;
      });

      this.tagList = tags_list;
      this.tagList.unshift({
        tags_name: '所有',
        _id: -1
      });

      this.getWorksList();
    },
    methods: {
      async getWorksList() {
        let a = {
          keyword: this.search.keyword,
          tag: this.search.tag === -1 ? '' : this.search.tag,
          state: this.search.state === -1 ? '' : this.search.state
        };

        let res = await this.$api.worksInterface.getWorksList({...a, ...this.table.args});
        let {code, data = {}} = res.data;
        if (code === 200) {
          this.table.body = data.list;
          this.table.args.total_count = data.total;
        }
      },
      handleWorks() {
        this.$router.push({
          name: 'create-works'
        })
      },
      handleSearch() {
        this.search.current_page = 1;
        this.getWorksList();
      },
      changePage(targetPage) {
        this.table.args.current_page = targetPage;
        this.getWorksList();
      },
      formatState(val) {
        return val === 0 ? "草稿" : "发布";
      }
    }
  }
</script>
