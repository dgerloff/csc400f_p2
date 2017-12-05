var pow_slider = document.getElementById('slider-power');
var ele_slider = document.getElementById('slider-elevation');
var azi_slider = document.getElementById('slider-azimuth');
var wb_checkbox = document.getElementById('check-wrecking');

var w_dist_input = document.getElementById('val-w_x');
var w_w_input = document.getElementById('val-w_width');
var w_h_input = document.getElementById('val-w_height');

var pow_label = document.getElementById('val-power');
var ele_label = document.getElementById('val-elevation');
var azi_label = document.getElementById('val-azimuth');

var launcher_power = parseFloat(pow_slider.value);
var launcher_elevation = parseFloat(ele_slider.value);
var launcher_azimuth = parseFloat(azi_slider.value);
var launcher_enabled = !wb_checkbox.checked;

function updateSlider(value,prop){
    if(prop !== 'wrecking')
        value = parseFloat(value);
    switch (prop){
        case 'power':
            launcher_power = value;
            pow_label.innerHTML = value;
            break;
        case 'elevation':
            launcher_elevation = value;
            ele_label.innerHTML = value.toFixed(1);
            break;
        case 'azimuth':
            launcher_azimuth = value;
            azi_label.innerHTML = value.toFixed(1)+'&deg;';
            break;
        case 'wrecking':
            if(wrecking_ball.ready == false){
                wrecking_ball.Initialize();
            }
            launcher_enabled = !value;
            break;
        case 'wall':
            setup_wall([parseInt(w_dist_input.value),1,0],parseInt(w_w_input.value),parseInt(w_h_input.value));
        default:
            break;
    }
}