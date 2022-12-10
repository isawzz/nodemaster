
function db_add_code() {
	let kw = prompt('Enter Keywords');
	let text = dCode.value; //textContent;
	console.log('saving', kw, text);
	let code = { kw: kw, c: text };
	let data = { table: 'code', item: code };
	lookupAddToList(DB,['code'],code);
	post_json('http://localhost:3000/db/add/code', code, r => console.log('resp', r));

}
function db_init_code() {
	let code = [
		{ kw: 'post route', c: `post_json('http://localhost:3000/post/json',o,r=>console.log('resp',r));` },
		{ kw: 'get yaml route', c: `await route_path_yaml_dict('http://localhost:3000/route')` },
		{ kw: 'get json route', c: `await route_path_json('http://localhost:3000/route')` },
	];
	//das soll jetzt in die db geschrieben werden als 'code' key
	DB.code = code;
	post_json('http://localhost:3000/db/init/code', code, r => console.log('resp', r));
}
function db_list_code(){

	for(const code of DB.code){

	}
}
async function db_load() { DB = await route_path_yaml_dict('http://localhost:3000/file?name=db'); console.log('DB',DB)}
