package teropa.ko2010.client;

import com.allen_sauer.gwt.dnd.client.DragEndEvent;
import com.allen_sauer.gwt.dnd.client.DragHandlerAdapter;
import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.FocusPanel;
import com.google.gwt.user.client.ui.Label;

public class TimeControl extends Composite {

	private final FlowPanel container = new FlowPanel();
	private final AbsolutePanel sliderTrack = new AbsolutePanel();
	private final FlowPanel sliderTrackBg = new FlowPanel();
	private final FocusPanel sliderKnob = new FocusPanel();
	
	private final Label info = new Label();
	
	private final EpidemicLayer layer;
	
	private final PickupDragController dragController = new PickupDragController(sliderTrack, true);
	
	
	public TimeControl(EpidemicLayer layer) {
		this.layer = layer;
		info.setText(layer.getTimeStep()+"");
		initWidget(container);
		setStyleName("TimeControl");
		initControl();
		
		info.setStyleName("TimeControlInfo");
		container.add(info);
	}

	private void initControl() {
		dragController.setConstrainWidgetToBoundaryPanel(true);
		dragController.setBehaviorDragProxy(false);
		
		sliderTrack.setStyleName("SliderTrack");
		container.add(sliderTrack);
	
		sliderTrackBg.setStyleName("SliderTrackBg");
		sliderTrack.add(sliderTrackBg, 0, 12);
		
		sliderKnob.setStyleName("SliderKnob");
		sliderTrack.add(sliderKnob, 0, 0);
		dragController.makeDraggable(sliderKnob);
		
		dragController.addDragHandler(new DragHandlerAdapter() {
			public void onDragEnd(DragEndEvent event) {
				double left = sliderTrack.getWidgetLeft(sliderKnob);
				double width = sliderTrack.getOffsetWidth();
				int step = (int)Math.floor((left / width) * (Client.NUM_STEPS + 1));
				layer.setTimestep(step);
				info.setText(""+step);
			}
		});
	}
	
}
