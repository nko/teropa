package teropa.ko2010.client;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.ListBox;

public class TimeControl extends Composite {

	private final FlowPanel container = new FlowPanel();
	private final EpidemicLayer layer;
	
	public TimeControl(EpidemicLayer layer) {
		this.layer = layer;
		initWidget(container);
		setStyleName("TimeControl");
		initControl();		
	}

	private void initControl() {
		final ListBox dropdown = new ListBox();
		for (int i=0 ; i<10 ; i++) {
			dropdown.addItem(""+i);
		}
		dropdown.addChangeHandler(new ChangeHandler() {
			public void onChange(ChangeEvent event) {
				layer.setTimestep(Integer.valueOf(dropdown.getValue(dropdown.getSelectedIndex())));
			}
		});
		container.add(dropdown);
	}
	
}
